# QuickPrint Campus

A hyper-modern, zero-download printing platform for campus environments. This application allows students to upload documents for printing without downloading them to the shop's computer, streamlining the workflow for print shops.

## 🚀 Key Features

### For Students
-   **Zero-Friction Uploads**: Drag & Drop interface to upload PDFs instantly.
-   **Live Cart**: Add multiple files, configure each (Color/B&W, Copies, Duplex), and checkout in one go.
-   **Transparent Pricing**: See the exact cost before placing an order.

### For Shop Owners
-   **Command Center Dashboard**: Real-time view of all incoming orders.
-   **Zero-Download Printing**: Print directly from the browser using `print-js` without saving files locally.
-   **Live Status Updates**: Mark items as "Printed" or update order status (Pending → Processing → Completed).
-   **Dynamic Pricing**: Adjust per-page rates for Color/B&W printing instantly.

## 🛠️ Architecture (Micro-Frontends)

The project is split into three main components for modularity and security:

1.  **Backend (`server/`)**: FastAPI + MySQL. Handles logic, database, and file storage.
2.  **Student App (`client-student/`)**: React. Dedicated interface for students (Port `5173`).
3.  **Shop App (`client-shop/`)**: React. Dedicated secured interface for shop owners (Port `5174`).

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

### Step 2: Backend Setup
Open a terminal in the project root folder:

```powershell
# 1. Navigate to server folder
cd server

# 2. Create virtual environment (if not already created)
python -m venv venv

# 3. Activate virtual environment
.\venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
# Create a file named .env inside the server/ folder and add this line:
# DATABASE_URL=mysql+pymysql://root:@127.0.0.1:3306/quickprint_campus

# 6. Run the server
uvicorn main:app --reload --host 0.0.0.0
```
*The backend API will start at `http://localhost:8000`*

### Step 3: Run Student App
Open a **new** terminal:

```powershell
cd client-student
npm install
npm run dev
```
*The Student App will start at `http://localhost:5173`*

### Step 4: Run Shop App
Open a **new** terminal:

```powershell
cd client-shop
npm install
npm run dev
```
*The Shop App will start at `http://localhost:5174`*

### Step 5: Seed Data (First Run Only)
To create initial test users (Shop Owner ID: 2, Student ID: 1), run this command in the **root** folder (with venv activated):

```powershell
python seed_data.py
```

---

## 📱 Usage Guide

### 🧑‍🎓 Student Flow (Port 5173)
1.  Go to `http://localhost:5173`
2.  Drag & drop PDF files.
3.  Configure print settings (Copies, Color, Duplex).
4.  Add to Cart and checkout.

### 🏪 Shop Owner Flow (Port 5174)
1.  Go to `http://localhost:5174`
2.  **Dashboard**: See new orders appear instantly.
3.  **Preview**: Click the **Eye (👁)** icon to verify the file content.
4.  **Print**: Click **Print** to send it to the physical printer.
5.  **Mark Printed**: Click the **Check (✓)** to clear it from the queue.

---

## ⚠️ Troubleshooting

-   **"Failed to process file" / Database Error?**
    -   Ensure XAMPP MySQL is running.
    -   Ensure `server/.env` uses `127.0.0.1` and NOT `localhost` (Windows IPv6 issue).
-   **App Blank/White Screen?**
    -   Check the terminal for errors.
    -   Ensure you are running the correct app on the correct port (`student`=5173, `shop`=5174).

## License
[MIT](LICENSE)
