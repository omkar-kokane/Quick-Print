# QuickPrint Campus

A hyper-modern, zero-download printing platform for campus environments. This application allows students to upload documents for printing without downloading them to the shop's computer, streamlining the workflow for print shops.

## 🚀 Features

-   **Zero-Download Printing**: Shopkeepers can print directly from the dashboard using `print-js`.
-   **Hyper-Modern UI**: Glassmorphism, animated mesh gradients, and 3D effects.
-   **Live Order Dashboard**: Real-time order tracking with status updates (Pending, Processing, Completed).
-   **Dynamic Pricing**: Configurable per-page rates for B&W and Color printing.
-   **PDF Preview**: In-browser secure PDF preview.
-   **Queue Management**: Filter and sort orders for efficient processing.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion
-   **Backend**: FastAPI (Python), SQLAlchemy, Pydantic
-   **Database**: MySQL (via XAMPP)
-   **Storage**: Local file storage

---

## 🏁 How to Run (Step-by-Step)

### Prerequisites
1.  **Node.js** (Download from [nodejs.org](https://nodejs.org/))
2.  **Python 3.8+** (Download from [python.org](https://python.org/))
3.  **XAMPP** (Download from [apachefriends.org](https://www.apachefriends.org/)) - *Required for MySQL Database*

### Step 1: Database Setup
1.  Open **XAMPP Control Panel**.
2.  Start **Apache** and **MySQL**.
3.  Click **Admin** next to MySQL to open phpMyAdmin (or go to `http://localhost/phpmyadmin`).
4.  Click **New** in the sidebar.
5.  Create a database named: `quickprint_campus`
    *   *Note: No need to create tables manually, the backend will do it automatically.*

### Step 2: Backend Setup (Server)
Open a terminal in the project root folder:

```powershell
# 1. Navigate to server folder
cd server

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
.\venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
# Create a file named .env inside the server/ folder and add this line:
# DATABASE_URL=mysql+pymysql://root:@localhost:3306/quickprint_campus

# 6. Run the server
uvicorn main:app --reload
```
*The backend API will start at `http://localhost:8000`*

### Step 3: Frontend Setup (Client)
Open a **new** terminal in the project root folder:

```powershell
# 1. Navigate to client folder
cd client

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```
*The frontend will start at `http://localhost:5173`*

### Step 4: Initial Setup (First Run Only)
To create the test users (Student and Shop Owner), run this script in a new terminal:

```powershell
# Make sure you are in the root folder and venv is activated
.\server\venv\Scripts\python seed_data.py
```

---

## 📱 Usage Guide

### For Students (Home Page)
1.  Go to `http://localhost:5173`
2.  Drag & drop a PDF file.
3.  Select options: **Color/B&W**, **Copies**, **Duplex**.
4.  Click **Place Order**.

### For Shop Owners (Dashboard)
1.  Go to `http://localhost:5173/shop`
2.  **View Orders**: See incoming print jobs in real-time.
3.  **Preview**: Click the **Eye (👁)** icon to preview the PDF without downloading.
4.  **Print**: Click **Print** to open the system print dialog directly.
5.  **Complete**: Click the **Check (✓)** icon to mark items as printed.
6.  **Settings**: Click the **Gear (⚙️)** icon to set per-page prices.

## ⚠️ Troubleshooting

-   **White Screen?**
    -   Try a hard refresh: `Ctrl + Shift + R`.
    -   Ensure the backend server is running on port 8000.
-   **Database Error?**
    -   Make sure XAMPP MySQL is running.
    -   Check if `quickprint_campus` database exists in phpMyAdmin.
    -   Verify `server/.env` has the correct `DATABASE_URL`.

## License

[MIT](LICENSE)
