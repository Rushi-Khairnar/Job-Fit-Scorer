export const PYTHON_APP_CODE = `import streamlit as st
import pandas as pd
import numpy as np
import spacy
import pdfplumber
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

# ==========================================
# 1. CONFIGURATION & CACHING
# ==========================================
st.set_page_config(page_title="Job-Fit Scorer", page_icon="🎯", layout="wide")

@st.cache_resource
def load_models():
    """
    Load NLP models and cache them so they don't reload on every UI interaction.
    """
    # Load spaCy model for text preprocessing
    try:
        nlp = spacy.load('en_core_web_sm')
    except OSError:
        import os
        os.system("python -m spacy download en_core_web_sm")
        nlp = spacy.load('en_core_web_sm')
    
    # Load Sentence Transformer for semantic similarity (Primary Approach)
    # 'all-MiniLM-L6-v2' maps sentences & paragraphs to a 384 dimensional dense vector space.
    semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
    return nlp, semantic_model

nlp, semantic_model = load_models()

# ==========================================
# 2. TAXONOMY & MOCK DATA HANDLER
# ==========================================
# Comprehensive technical skill taxonomy
SKILL_TAXONOMY = [
    "python", "sql", "machine learning", "django", "pandas", 
    "scikit-learn", "statistics", "tableau", "aws", "docker", 
    "kubernetes", "react", "javascript", "deep learning", 
    "tensorflow", "pytorch", "nlp", "data visualization", 
    "git", "agile", "c++", "java", "nosql", "mongodb", "azure",
    "gcp", "power bi", "excel", "r", "spark", "hadoop",
    "flask", "fastapi", "html", "css", "node.js"
]

@st.cache_data
def load_mock_data():
    """
    Provides a highly realistic mock dataset of job descriptions.
    """
    data = [
        {
            "Role": "Data Scientist",
            "Description": "We are seeking a Data Scientist to analyze complex data sets and build predictive models. You must be proficient in Python, SQL, and Machine Learning frameworks like TensorFlow and Scikit-learn. Strong knowledge of Statistics and Pandas is required. Experience with Data Visualization using Tableau is a plus."
        },
        {
            "Role": "Software Engineer",
            "Description": "Looking for a Backend Software Engineer. Primary responsibilities include building scalable web applications using Python and Django. Must have strong experience with SQL databases and Git for version control. Knowledge of Docker and AWS is highly desired. Agile environment."
        },
        {
            "Role": "Data Analyst",
            "Description": "Join our team as a Data Analyst. You will clean and explore data, build dashboards in Power BI and Tableau, and run advanced SQL queries. Strong Excel skills and foundational Statistics are necessary. Python and R are nice to have."
        },
        {
            "Role": "Cloud Architect",
            "Description": "We need a Cloud Architect to design and maintain our infrastructure. Expertise in AWS, Azure, and GCP is crucial. You must have deep experience with Kubernetes, Docker, and CI/CD pipelines. Scripting in Python or Java is required."
        }
    ]
    return pd.DataFrame(data)

jobs_df = load_mock_data()

# ==========================================
# 3. TEXT PREPROCESSING & NLP PIPELINE
# ==========================================
def preprocess_text(text):
    """
    Cleans text using spaCy: tokenization, lowercasing, stopword/punctuation removal, and lemmatization.
    """
    # Lowercase and parse
    doc = nlp(text.lower())
    
    # Extract lemmatized root forms of valid tokens
    tokens = [
        token.lemma_ for token in doc 
        if not token.is_stop and not token.is_punct and len(token.text.strip()) > 1
    ]
    return " ".join(tokens)

def extract_skills(text):
    """
    Matches text against the skill taxonomy to find present skills.
    Uses word boundaries to prevent partial matches (e.g., 'r' inside 'docker').
    """
    text_lower = text.lower()
    found_skills = set()
    for skill in SKILL_TAXONOMY:
        # Regex \\b for exact word boundary match
        if re.search(r'\\b' + re.escape(skill) + r'\\b', text_lower):
            found_skills.add(skill)
    return found_skills

# ==========================================
# 4. SCORING ENGINE
# ==========================================
def calculate_scores(resume_text, jobs_df):
    """
    Computes both TF-IDF (baseline) and Sentence-Transformer (semantic) scores.
    """
    # Preprocess everything
    resume_proc = preprocess_text(resume_text)
    jobs_proc = [preprocess_text(desc) for desc in jobs_df["Description"]]
    
    # --- BASELINE: TF-IDF ---
    tfidf_vectorizer = TfidfVectorizer()
    # Combine to fit the vocabulary across all documents
    all_docs = [resume_proc] + jobs_proc
    tfidf_matrix = tfidf_vectorizer.fit_transform(all_docs)
    
    # Calculate Cosine Similarity (Resume is index 0, Jobs are index 1 to N)
    tfidf_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    
    # --- PRIMARY: Semantic (Sentence Transformers) ---
    resume_emb = semantic_model.encode([resume_proc])
    jobs_emb = semantic_model.encode(jobs_proc)
    
    semantic_sim = cosine_similarity(resume_emb, jobs_emb).flatten()
    
    return tfidf_sim, semantic_sim

# ==========================================
# 5. STREAMLIT FRONTEND
# ==========================================
def main():
    st.title("🎯 Job-Fit Scorer")
    st.markdown("""
    **Final Year BSc Data Science Project**  
    Matching Students to Job Roles Using NLP & Semantic Similarity.
    """)
    
    st.divider()
    
    # FILE UPLOADER
    st.subheader("1. Upload Student Resume")
    uploaded_file = st.file_uploader("Upload Resume (PDF format)", type=["pdf"])
    
    if uploaded_file is not None:
        # PROFILE INGESTION (PDF Parsing)
        with st.spinner("Extracting text from PDF..."):
            resume_text = ""
            with pdfplumber.open(uploaded_file) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        resume_text += extracted + "\\n"
        
        if not resume_text.strip():
            st.error("Could not extract text from the PDF. Please try a different file.")
            return
            
        st.success("Resume parsed successfully!")
        
        with st.expander("View Extracted Resume Text"):
            st.text(resume_text)
        
        # PROCESSING & SCORING
        with st.spinner("Analyzing profile against job market..."):
            # Calculate Match Scores
            tfidf_scores, sem_scores = calculate_scores(resume_text, jobs_df)
            
            # Extract Skills
            resume_skills = extract_skills(resume_text)
            
            # Compile Results
            results = jobs_df.copy()
            results["TF-IDF Match (%)"] = np.round(tfidf_scores * 100, 2)
            results["Semantic Match (%)"] = np.round(sem_scores * 100, 2)
            
            # Sort by the primary semantic approach
            results = results.sort_values(by="Semantic Match (%)", ascending=False).reset_index(drop=True)
            
        st.divider()
        
        # DASHBOARD DISPLAY
        st.subheader("2. Ranking Results")
        st.markdown("Comparing the Lexical Baseline (TF-IDF) vs. the Contextual Semantic Model (all-MiniLM-L6-v2).")
        
        # Display results cleanly
        st.dataframe(
            results[["Role", "TF-IDF Match (%)", "Semantic Match (%)"]].style.background_gradient(cmap="Greens"),
            use_container_width=True
        )
        
        st.divider()
        
        # SKILL GAP ANALYSIS
        st.subheader("3. Skill Gap Analysis")
        st.markdown(f"**Student Skills Found:** \`{', '.join(resume_skills) if resume_skills else 'None detected'}\`")
        
        for index, row in results.iterrows():
            # Extract required skills for this job
            job_skills = extract_skills(row["Description"])
            
            # Calculate missing skills
            missing_skills = job_skills - resume_skills
            matching_skills = job_skills.intersection(resume_skills)
            
            # UI Card for Job Role
            with st.expander(f"Report: {row['Role']} ({row['Semantic Match (%)']}% Semantic Match)"):
                st.write(f"**Job Description:** {row['Description']}")
                st.write("---")
                col1, col2 = st.columns(2)
                
                with col1:
                    st.markdown("✅ **Matching Skills**")
                    if matching_skills:
                        for skill in matching_skills:
                            st.markdown(f"- {skill.title()}")
                    else:
                        st.write("None")
                        
                with col2:
                    st.markdown("❌ **Skill Gaps (Missing)**")
                    if missing_skills:
                        for skill in missing_skills:
                            st.markdown(f"- {skill.title()}")
                    else:
                        st.write("None! You meet all extracted technical requirements.")

if __name__ == "__main__":
    main()
`;
