import os
import threading
import base64
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes

# File paths for keys
PRIVATE_KEY_FILE = "private_key.pem"
PUBLIC_KEY_FILE = "public_key.pem"
FERNET_KEY_FILE = "encrypted_fernet_key.bin"

# Step 1: Generate RSA Key Pair (Only if not already generated)
def generate_rsa_keys():
    if os.path.exists(PRIVATE_KEY_FILE) and os.path.exists(PUBLIC_KEY_FILE):
        print("RSA keys already exist.")
        return

    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    public_key = private_key.public_key()

    # Save private key
    with open(PRIVATE_KEY_FILE, "wb") as private_file:
        private_file.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ))

    # Save public key
    with open(PUBLIC_KEY_FILE, "wb") as public_file:
        public_file.write(public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ))

    print("RSA key pair generated and saved.")

# Step 2: Generate and encrypt Fernet key (Only if not already generated)
def generate_fernet_key():
    if os.path.exists(FERNET_KEY_FILE):
        print("Encrypted Fernet key already exists.")
        return

    fernet_key = Fernet.generate_key()

    # Load RSA public key
    with open(PUBLIC_KEY_FILE, "rb") as public_file:
        public_key = serialization.load_pem_public_key(public_file.read())

    encrypted_fernet_key = public_key.encrypt(
        fernet_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    with open(FERNET_KEY_FILE, "wb") as enc_key_file:
        enc_key_file.write(encrypted_fernet_key)

    print("Fernet key generated and encrypted with RSA public key.")

# Step 3: Decrypt Fernet key using RSA private key
def decrypt_fernet_key():
    if not os.path.exists(PRIVATE_KEY_FILE) or not os.path.exists(FERNET_KEY_FILE):
        print("Missing keys! Cannot decrypt Fernet key.")
        return None

    with open(PRIVATE_KEY_FILE, "rb") as private_file:
        private_key = serialization.load_pem_private_key(private_file.read(), password=None)

    with open(FERNET_KEY_FILE, "rb") as enc_key_file:
        encrypted_fernet_key = enc_key_file.read()

    decrypted_fernet_key = private_key.decrypt(
        encrypted_fernet_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    print("Fernet key decrypted successfully.")
    return decrypted_fernet_key

# Step 4: Encrypt a selected file with Fernet
def encrypt_file(progress_bar, status_label, key):
    file_path = filedialog.askopenfilename(title="Select a file to encrypt")
    if not file_path:
        messagebox.showwarning("Warning", "No file selected.")
        return

    progress_bar.start()
    status_label.config(text="Encrypting file...")

    def encrypt():
        fernet = Fernet(key)
        with open(file_path, "rb") as file:
            file_data = file.read()
        
        encrypted_data = fernet.encrypt(file_data)
        encrypted_file_path = file_path + ".enc"

        with open(encrypted_file_path, "wb") as enc_file:
            enc_file.write(encrypted_data)

        progress_bar.stop()
        status_label.config(text=f"File encrypted: {encrypted_file_path}")
        messagebox.showinfo("Success", f"File encrypted successfully: {encrypted_file_path}")

    threading.Thread(target=encrypt).start()

# Step 5: Decrypt a selected file with Fernet
def decrypt_file(progress_bar, status_label, key):
    file_path = filedialog.askopenfilename(title="Select an encrypted file to decrypt", filetypes=[("Encrypted files", "*.enc")])
    if not file_path:
        messagebox.showwarning("Warning", "No file selected.")
        return

    progress_bar.start()
    status_label.config(text="Decrypting file...")

    def decrypt():
        fernet = Fernet(key)
        with open(file_path, "rb") as enc_file:
            encrypted_data = enc_file.read()
        
        decrypted_data = fernet.decrypt(encrypted_data)
        original_file_path = file_path.replace(".enc", "")

        with open(original_file_path, "wb") as dec_file:
            dec_file.write(decrypted_data)

        progress_bar.stop()
        status_label.config(text=f"File decrypted: {original_file_path}")
        messagebox.showinfo("Success", f"File decrypted successfully: {original_file_path}")

    threading.Thread(target=decrypt).start()

# GUI application
def run_gui():
    root = tk.Tk()
    root.title("File Encryption & Decryption")
    root.geometry("400x300")
    
    heading = tk.Label(root, text="Secure File Encryption", font=("Arial", 16, "bold"))
    heading.pack(pady=10)

    progress_bar = ttk.Progressbar(root, mode='indeterminate', length=300)
    progress_bar.pack(pady=20)

    status_label = tk.Label(root, text="Choose an option below", font=("Arial", 12))
    status_label.pack(pady=5)

    # Buttons
    btn_encrypt = ttk.Button(root, text="Encrypt File", command=lambda: encrypt_file(progress_bar, status_label, fernet_key))
    btn_encrypt.pack(pady=5)

    btn_decrypt = ttk.Button(root, text="Decrypt File", command=lambda: decrypt_file(progress_bar, status_label, decrypted_key))
    btn_decrypt.pack(pady=5)

    btn_exit = ttk.Button(root, text="Exit", command=root.quit)
    btn_exit.pack(pady=5)

    root.mainloop()

if __name__ == "__main__":
    # Ensure RSA keys exist before proceeding
    generate_rsa_keys()

    # Generate and encrypt Fernet key if needed
    generate_fernet_key()

    # Decrypt Fernet key using RSA private key
    decrypted_key = decrypt_fernet_key()

    if decrypted_key is None:
        messagebox.showerror("Error", "Decryption failed! Missing RSA keys or encrypted Fernet key.")
    else:
        # Run the GUI
        run_gui()
