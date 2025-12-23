import { useState } from 'react'
import './App.css'

function App() {
  const [description, setDescription] = useState('')
  const [inputDesc, setInputDesc] = useState('')
  const [outputDesc, setOutputDesc] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    if (!description || !inputDesc || !outputDesc) {
      alert("Please fill in all fields.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          input_description: inputDesc,
          output_description: outputDesc
        })
      })
      const data = await response.json()
      setPrediction(data)
    } catch (err) {
      console.error(err)
      alert("Failed to get prediction. Is the server running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header>
        <div className="badge-row">
          <span className="calibration-badge">Calibrated: Codeforces API v1.2</span>
        </div>
        <h1>AutoJudge</h1>
        <p className="subtitle">Real-world calibrated difficulty prediction for competitive programming</p>
      </header>

      <div className="input-group">
        <div className="input-field">
          <label>Problem Description</label>
          <textarea
            placeholder="Describe the logic and constraints..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="input-field">
          <label>Input Description</label>
          <textarea
            placeholder="Describe the input format and types..."
            value={inputDesc}
            onChange={(e) => setInputDesc(e.target.value)}
          />
        </div>

        <div className="input-field">
          <label>Output Description</label>
          <textarea
            placeholder="Describe the expected output format..."
            value={outputDesc}
            onChange={(e) => setOutputDesc(e.target.value)}
          />
        </div>

        <button
          className="predict-btn"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Predict Difficulty"}
        </button>
      </div>

      {prediction && (
        <div className="result-card">
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Predicted Class</span>
              <span className={`result-value badge-${prediction.problem_class}`}>
                {prediction.problem_class}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Difficulty Score</span>
              <span className="result-value">
                {prediction.problem_score}
              </span>
            </div>
          </div>

          <div className="diagnostics">
            <h3>AI Analysis Breakdown</h3>
            <div className="diag-grid">
              <div className="diag-item">
                <span className="diag-label">Text Density</span>
                <span className="diag-val">{prediction.diagnostics.textLength} chars</span>
              </div>
              <div className="diag-item">
                <span className="diag-label">Math Symbols</span>
                <span className="diag-val">{prediction.diagnostics.mathCount} detected</span>
              </div>
              <div className="diag-item">
                <span className="diag-label">Vocab Diversity</span>
                <span className="diag-val">{prediction.diagnostics.vocabularyDiversity}</span>
              </div>
            </div>
            {prediction.diagnostics.detectedTags.length > 0 && (
              <div className="tags-section">
                <span className="diag-label">Algorithmic Indicators:</span>
                <div className="tags-container">
                  {prediction.diagnostics.detectedTags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
