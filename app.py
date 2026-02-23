from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import os
import psycopg2

# Initialisation Flask
app = Flask(__name__)
app.secret_key = "160706s240507k"  # clé secrète pour les sessions

# Connexion
db = psycopg2.connect(
    host=os.environ.get("PGHOST"),
    user=os.environ.get("PGUSER"),
    password=os.environ.get("PGPASSWORD"),
    database=os.environ.get("PGDATABASE"),
    port=os.environ.get("PGPORT")
)
cursor = db.cursor()

# ------------------ Inscription ------------------
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        cursor.execute("INSERT INTO utilisateur (username, mdp) VALUES (%s, %s)", (username, password))
        db.commit()
        return redirect(url_for("login"))

    return render_template("register.html")
#def encrypt_password(password, key):
#    return "".join(chr(ord(c) ^ key) for c in password)

# ------------------ Connexion ------------------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        cursor.execute("SELECT * FROM utilisateur WHERE username=%s AND mdp=%s", (username, password))
        user = cursor.fetchone()

        if user:
            session["username"] = username
            return redirect(url_for("home"))
        else:
            return redirect(url_for("login"))

    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("login"))

# ------------------ Page d'accueil ------------------
@app.route("/")
def home():
    if "username" in session:
        return render_template("index.html", user=session["username"])
    else:
        return redirect(url_for("login"))

# ------------------ Dépenses CRUD ------------------
@app.route("/ajouter", methods=["POST"])
def ajouter_depenses():
    if "username" not in session:
        return jsonify({"error": "Vous devez être connecté"}), 403

    data = request.json

    # Récupérer l'ID de l'utilisateur connecté
    cursor.execute("SELECT id FROM utilisateur WHERE username=%s", (session["username"],))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    user_id = user[0]

    # Insérer la dépense avec user_id
    cursor.execute(
        "INSERT INTO depenses (Description, Categorie, Montant, DateDepense, user_id) VALUES (%s, %s, %s, %s, %s)",
        (data["description"], data["categorie"], data["montant"], data["date"], user_id)
    )
    db.commit()
    return jsonify({"message": "Dépense ajoutée !!!"})

@app.route("/liste", methods=["GET"])
def liste_depenses():
    if "username" not in session:
        return jsonify({"error": "Vous devez être connecté"}), 403

    cursor.execute("SELECT id FROM utilisateur WHERE username=%s", (session["username"],))
    user = cursor.fetchone()
    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    user_id = user[0]

    cursor.execute("SELECT * FROM depenses WHERE user_id=%s", (user_id,))
    rows = cursor.fetchall()
    return jsonify(rows)

@app.route("/sum", methods=["GET"])
def sum_depenses():
    if "username" not in session:
        return jsonify({"error": "Vous devez être connecté"}), 403

    cursor.execute("SELECT id FROM utilisateur WHERE username=%s", (session["username"],))
    user = cursor.fetchone()
    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    user_id = user[0]

    cursor.execute("SELECT SUM(Montant), DateDepense FROM depenses WHERE user_id=%s GROUP BY DateDepense ORDER BY DateDepense ASC", (user_id,))
    rows = cursor.fetchall()
    return jsonify(rows)

# ------------------ Lancement ------------------
if __name__ == '__main__':
    app.run(debug=True)
