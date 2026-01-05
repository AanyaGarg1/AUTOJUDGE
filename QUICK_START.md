# AutoJudge - Quick Start Guide for Evaluators

**Welcome!** This guide helps you quickly set up and test the AutoJudge project.

---

## ⚡ 5-Minute Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR-USERNAME/autojudge.git
cd autojudge
```

### Step 2: Install Backend
```bash
npm install
```
*(Installs Express, ML libraries, and dependencies)*

### Step 3: Start Backend Server
```bash
node server.js
```
**Expected Output:**
```
Model loaded successfully.
Server running on port 5000
```
✅ Backend is ready

### Step 4: Install & Start Frontend (in new terminal)
```bash
cd frontend
npm install
npm run dev
```
**Expected Output:**
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```
✅ Frontend is ready

### Step 5: Open Browser
Navigate to **http://localhost:5173**

✅ **System is running!**

---

## 🧪 Test the System (2 minutes)

### Test Case 1: Easy Problem
Copy-paste into the input fields:
```
Problem Description:
"Given an array of integers, find the sum of all elements and print it."

Input Description:
"n integers"

Output Description:
"one integer (sum)"
```
**Expected Result:** Easy, score ~850–900

### Test Case 2: Medium Problem
```
Problem Description:
"Sort an array using quicksort algorithm and find the median element"

Input Description:
"n integers"

Output Description:
"median element"
```
**Expected Result:** Medium, score ~1200–1400

### Test Case 3: Hard Problem
```
Problem Description:
"Compute minimum cost maximum flow using successive shortest paths with ∑ capacity constraints"

Input Description:
"Adjacency matrix with edge weights and capacities"

Output Description:
"Maximum flow value and minimum cost"
```
**Expected Result:** Hard, score ~2200–2800

---

## 📊 View Performance Metrics

Check **metrics.json** for detailed evaluation:
```bash
cat metrics.json
```

You'll see:
- **Classification Accuracy**: 99.95% ⭐
- **Confusion Matrix**: Nearly perfect (1 error in 2,080 samples)
- **Regression MAE**: 17.23 points
- **Regression RMSE**: 20.66 points

---

## 📂 Project Structure
```
autojudge/
├── server.js          ← Express API server
├── train_model.js     ← ML training script
├── model.json         ← Pre-trained models
├── metrics.json       ← Performance metrics
├── README.md          ← Full documentation
├── REPORT.md          ← Detailed report
└── frontend/
    ├── src/App.jsx    ← React UI
    └── package.json   ← Dependencies
```

---

## 🔍 Key Features

✅ **Classification**: Easy, Medium, or Hard  
✅ **Regression**: Numerical difficulty score  
✅ **NLP-based**: Uses 7 engineered text features  
✅ **Fast Predictions**: < 1 second per problem  
✅ **Modern UI**: Clean, responsive interface  
✅ **API Ready**: REST endpoint for predictions  

---

## 📈 Model Performance

| Metric | Performance |
|--------|-------------|
| Classification Accuracy | 99.95% ⭐ |
| Easy Class Precision | 100% |
| Medium Class Precision | 100% |
| Hard Class Precision | 99.83% |
| Regression MAE | 17.23 points |
| Regression RMSE | 20.66 points |

---

## 🔧 API Endpoint (Advanced)

If you want to test the API directly:

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "description":"Find the sum of two numbers",
    "input_description":"Two integers a and b",
    "output_description":"One integer (sum)"
  }'
```

**Response:**
```json
{
  "problem_class": "Easy",
  "problem_score": 820,
  "diagnostics": {
    "textLength": 42,
    "mathCount": 0,
    "vocabularyDiversity": "66.7%",
    "detectedTags": ["simple"]
  }
}
```

---

## 📚 Documentation

- **README.md** - Complete project overview and setup instructions
- **REPORT.md** - Detailed 4–8 page academic report
- **SUBMISSION_CHECKLIST.md** - Full submission requirements and guide
- **metrics.json** - Detailed performance metrics from training

---

## ❓ Troubleshooting

### Port Already in Use
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Dependencies Issue
```bash
npm cache clean --force
npm install
```

### Model Not Loading
- Verify `model.json` exists in root directory
- Check it's valid JSON: `node -e "console.log(JSON.parse(require('fs').readFileSync('model.json')))"`

---

## ✨ What You're Seeing

### The UI Shows:
1. **Input Fields**: Where you describe the problem
2. **Predict Button**: Sends data to the backend
3. **Result Card**: Shows the predicted class and score
4. **Analysis Breakdown**: Features that influenced the prediction

### The Backend Does:
1. **Receives** problem description via HTTP
2. **Extracts** 7 features from the text
3. **Predicts** using trained Random Forest models
4. **Returns** class, score, and diagnostics

---

## 🎓 For Evaluators

**Model Approach:**
- Random Forest (200 trees) for classification and regression
- 7 engineered NLP features (text length, math symbols, keywords)
- 99.95% accuracy on 2,080 samples

**Data:**
- 25 real Codeforces problems as anchors
- 2,055 synthetically augmented samples
- Balanced classes (Easy 40%, Medium 40%, Hard 20%)

**Reproducibility:**
- All code is provided and clean
- Pre-trained models included (model.json)
- All metrics logged (metrics.json)
- No external APIs or dependencies beyond npm packages

---

**Setup Time**: ~5 minutes  
**Test Time**: ~2 minutes  
**Total Evaluation Time**: ~10 minutes  

Enjoy exploring AutoJudge! 🚀
