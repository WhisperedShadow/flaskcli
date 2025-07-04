# 🐍 FlaskCLI — Create & Manage Flask Projects Effortlessly

A simple Node.js-based CLI tool that helps you:

✅ Create a new Flask project with templates  
⚙️ Automatically set up a virtual environment  
📦 Install your favorite Flask dependencies  
🚀 Add routes and run the server quickly

---

## 📁 Project Structure on `init`

When you run `flaskcli init`, it creates:

```
your-project/
├── app.py
├── templates/
│   └── index.html
├── static/
├── venv/
├── requirements.txt
```

📌 Make sure you have a `template/` folder in your CLI project (outside `bin/`) which will be copied during setup.

---

## ⚙️ Installation

### To install your CLI locally (for development):

```bash
npm install -g .
```

### To link it locally (for testing without npm publish):

```bash
npm link
```

Now you can run `flaskcli` from anywhere in your terminal 🧙‍♂️

---

## 🚀 Usage

```bash
flaskcli <command> [options]
```

---

### 🔧 `init` — Create a Flask project

```bash
flaskcli init
```

📌 This will ask you:

- Project name  
- Dependencies to install (like `flask-cors`, `flask-login`, etc.)

It creates the folder, copies the template, creates a virtual environment, installs dependencies, and generates `requirements.txt`.

---

### 📦 `install` — Add dependencies to an existing project

```bash
flaskcli install flask-mail,flask-bcrypt
```

📌 Make sure you run this inside your project folder. It:

- Installs new dependencies inside venv  
- Updates `requirements.txt`

---

### ➕ `route` — Add a route dynamically

```bash
flaskcli route get /hello
```

Adds this to `app.py`:

```python
@app.route('/hello', methods=['GET'])
def handle_get__hello():
    return "Hello from GET /hello"
```

---

### ▶️ `run` — Start Flask server

```bash
flaskcli run
```

Runs `python app.py` using the created virtual environment.

---

### ❓ `help` — Show all commands

```bash
flaskcli help
```

---

## ✅ Requirements

- Python installed and added to PATH  
- Node.js v14+  
- `template/` folder with your base Flask files

---

## 🛠 Future Ideas

- Auto-create `routes.py` and blueprints  
- Auto-generate models and forms  
- Cross-platform support (UNIX/MacOS)

---

## 💻 Sample Command Flow

```bash
flaskcli init      # Choose: myapp  
                   # Select: flask-cors, flask-login  
cd myapp  
flaskcli install flask-mail  
flaskcli route post /submit  
flaskcli run
```

---

## 📃 License

MIT License

