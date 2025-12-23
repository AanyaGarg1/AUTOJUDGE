import pandas as pd
import numpy as np
import random

# Seed for reproducibility
random.seed(42)
np.random.seed(42)

def generate_random_description(category):
    easy_keywords = ["sum", "array", "numbers", "add", "minimum", "maximum", "simple", "integer", "print"]
    medium_keywords = ["sorting", "binary search", "greedy", "dynamic programming", "graph", "BFS", "DFS", "tree", "matrix", "optimization"]
    hard_keywords = ["max flow", "segment tree", "heavy-light decomposition", "FFT", "geometry", "persistent data structure", "bitmask DP", "Centroid Decomposition"]
    
    math_symbols = ["+", "-", "*", "/", ">", "<", "=", "∑", "∏", "log", "exp"]
    
    if category == "Easy":
        keywords = random.sample(easy_keywords, k=random.randint(2, 4))
        length = random.randint(15, 30)
        symbols_count = random.randint(1, 3)
    elif category == "Medium":
        keywords = random.sample(medium_keywords + easy_keywords, k=random.randint(3, 6))
        length = random.randint(30, 60)
        symbols_count = random.randint(3, 7)
    else: # Hard
        keywords = random.sample(hard_keywords + medium_keywords, k=random.randint(5, 8))
        length = random.randint(60, 120)
        symbols_count = random.randint(8, 15)
        
    # Generate fake problem text
    words = ["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor"]
    text = " ".join(random.choices(words, k=length))
    
    # Inject keywords and math symbols
    text_list = text.split()
    for kw in keywords:
        text_list[random.randint(0, len(text_list)-1)] = kw
    for _ in range(symbols_count):
        text_list[random.randint(0, len(text_list)-1)] = random.choice(math_symbols)
        
    return " ".join(text_list)

def generate_dataset(n=500):
    data = []
    for _ in range(n):
        problem_class = random.choices(["Easy", "Medium", "Hard"], weights=[0.4, 0.4, 0.2])[0]
        
        if problem_class == "Easy":
            score = random.randint(800, 1200)
        elif problem_class == "Medium":
            score = random.randint(1300, 1900)
        else:
            score = random.randint(2000, 3500)
            
        title = f"Problem {random.randint(1000, 9999)}"
        description = generate_random_description(problem_class)
        input_desc = generate_random_description(problem_class)
        output_desc = generate_random_description(problem_class)
        
        data.append({
            "title": title,
            "description": description,
            "input_description": input_desc,
            "output_description": output_desc,
            "problem_class": problem_class,
            "problem_score": score
        })
        
    df = pd.DataFrame(data)
    df.to_csv("problems.csv", index=False)
    print(f"Generated dataset with {n} samples saved to problems.csv")

if __name__ == "__main__":
    generate_dataset(1000)
