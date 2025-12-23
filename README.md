# AutoJudge: Predicting Programming Problem Difficulty

AutoJudge is an intelligent system that automatically predicts the difficulty class (Easy, Medium, Hard) and numerical difficulty score of programming problems based only on their textual descriptions.

## Features
- **Classification**: Predicts if a problem is Easy, Medium, or Hard.
- **Regression**: Predicts a numerical difficulty score.
- **Natural Language Processing**: Extracts features from text descriptions, input formats, and output expectations.
- **Modern UI**: A premium, glassmorphic web interface built with React and Vite.

## Tech Stack
- **Frontend**: React.js, Vite, Vanilla CSS (Modern Design)
- **Backend**: Node.js, Express
- **Machine Learning**: `ml-random-forest` for classification and regression, `natural` for NLP feature extraction.

## Dataset
The system is trained on a synthetic dataset (simulating Codeforces/Kattis data) containing:
- Problem titles
- Descriptions
- Input/Output specifications
- Difficulty labels and scores

## Feature Engineering Approach
The model uses the following features extracted from the text:
1. **Text Length**: Longer descriptions often correlate with higher complexity.
2. **Mathematical Density**: Counting symbols like `∑, ∏, log, exp` which often appear in harder algorithmic problems.
3. **Keyword Frequency**: Identifying presence of algorithmic terms like `dp`, `graph`, `recursion`, `tree`, `flow`, etc.

## How to Run
1. **Install Dependencies**:
   ```bash
   npm install
   cd frontend && npm install
   ```
2. **Train the Model**:
   ```bash
   node train_model.js
   ```
3. **Start Backend**:
   ```bash
   node server.js
   ```
4. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## Results
- **Classification Accuracy**: ~100% (on synthetic data)
- **Regression MAE**: ~85 (on synthetic data)
