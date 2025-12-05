# QuickPrint Campus

A hyper-modern, zero-download printing platform for campus environments. This application allows students to upload documents for printing without downloading them to the shop's computer, streamlining the workflow for print shops.

## Features

-   **Zero-Download Printing**: Shopkeepers can print directly from the dashboard using `print-js`.
-   **Hyper-Modern UI**: Glassmorphism, animated mesh gradients, and 3D effects.
-   **Live Order Dashboard**: Real-time order tracking with status updates (Pending, Processing, Completed).
-   **Dynamic Pricing**: Configurable per-page rates for B&W and Color printing.
-   **PDF Preview**: In-browser secure PDF preview.
-   **Queue Management**: Filter and sort orders for efficient processing.

## Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React
-   **Backend**: FastAPI (Python), SQLAlchemy, Pydantic
-   **Database**: MySQL (via XAMPP)
-   **Storage**: Local file storage (served via static mount)

## Setup Instructions

### Prerequisites

-   Node.js & npm
-   Python 3.8+
-   XAMPP (for MySQL)

### 1. Database Setup

1.  Start **Apache** and **MySQL** in XAMPP.
2.  Create a database named `quickprint_campus` in phpMyAdmin.

### 2. Backend Setup

```bash
cd server
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

pip install -r requirements.txt

# Create a .env file in the server directory with:
# DATABASE_URL=mysql+pymysql://root:@localhost:3306/quickprint_campus

# Run the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal).

## Usage

1.  **Student**: Go to the home page, upload a PDF, select print options (Color/B&W, Copies, etc.), and place the order.
2.  **Shop Owner**: Go to `/shop`. Use the dashboard to view orders, preview files, and mark them as printed.
    -   Click the **Settings (⚙️)** icon to configure pricing.
    -   Use the **Eye (👁)** icon to preview files.
    -   Click **Print** to send to the printer.
    -   Click the **Check (✓)** icon to mark items as printed.

## License

[MIT](LICENSE)
