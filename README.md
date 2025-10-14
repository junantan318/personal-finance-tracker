# CloudFinance  Serverless Personal Finance Tracker

CloudFinance is a cloud-native, serverless personal finance tracker built on **AWS**.  
It helps users record, categorize, and visualize income and expenses - with smart AI-assisted categorization, import/export to Excel, and a secure multi-user design.

This project started as a learning build to practice **AWS architecture**, **React frontend development**, and **AI integration** in a real-world context.

---

##  Overview

CloudFinance is designed as a **serverless full-stack application**:
- **Frontend:** React (Amplify Hosting)
- **Backend:** API Gateway (HTTP) -> AWS Lambda (Python) -> DynamoDB
- **Authentication:** Amazon Cognito (planned)
- **Storage/Exports:** S3 + openpyxl (Excel support)
- **AI Assistance:** Amazon Bedrock (Claude/Titan) for auto-categorization & import parsing

---

##  Current Features (MVP)

- **Serverless backend:**  
  - AWS API Gateway (HTTP) integrated with a single Lambda function written in Python.  
  - DynamoDB table (`finance-tx`) for transaction storage.  
- **Endpoints implemented:**  
  - `POST /transaction` - create a new transaction  
  - `GET /transactions` - list transactions  
  - `GET /summary` - get today's income/expense summary  
- **Minimal frontend (HTML/JS):**  
  - Simple UI that connects directly to the API.  
- **CORS enabled** for browser requests.  
- **Cost-efficient:** Fully pay-per-use serverless stack.

---

## Quick Start (MVP)

### Backend

1. **Deploy Lambda:**
   - Create a function named `finance-handler`
   - Set environment variable `TX_TABLE=finance-tx`

2. **Create DynamoDB Table:**
   - Table name: `finance-tx`
   - Partition key: `pk` (String)
   - Sort key: `sk` (String)

3. **Configure API Gateway Routes:**
   - `POST /transaction`
   - `GET /transactions`
   - `GET /summary`

4. **Enable CORS:**
   - Allowed origins: `*`
   - Methods: `GET, POST, OPTIONS`
   - Headers: `Content-Type`

### Frontend

1. Update the `API` variable in your HTML/React code with your **API Gateway Invoke URL**  
   Example:
   ```js
   const API = "https://your-api-id.execute-api.eu-north-1.amazonaws.com";

### Test

Run this command in your terminal (replace `YOUR_API_URL` with your API Gateway URL):

```bash```
curl -X POST "https://YOUR_API_URL/transaction" \
  -H "Content-Type: application/json" \
  -d '{"amount":10,"type":"expense","category":"Food","note":"Lunch"}'

You should receive a response like:

{
  "ok": true,
  "tx": {
    "pk": "user#demo",
    "sk": "tx#2025-10-14T12:00:00",
    "amount": 10,
    "type": "expense",
    "category": "Food",
    "note": "Lunch"
  }
}
---

## Roadmap

### **v0.2 - React UI + Authentication**
**Goal:** Migrate the frontend to React for a polished dashboard experience and add secure user authentication.

- [ ] Rebuild UI in **React** (Vite + TailwindCSS)
- [ ] Add **Cognito authentication** (sign-up/login)
- [ ] Secure all APIs with **JWT Authorizer**
- [ ] Use Cognito `sub` as DynamoDB partition key (`pk=user#<sub>`)

---

### **v0.3 -Categorization, Sorting & Counterparty Tracking**
**Goal:** Make expense tracking more meaningful and organized.

- [ ] Add new fields: `category`, `counterparty`, and `direction` ("in"/"out")  
- [ ] Sorting & filtering (by category, date, or counterparty)  
- [ ] Quick actions to tag transactions (e.g., "From Friend", "Food")  
- [ ] Improved DynamoDB schema for category grouping

---

### **v0.4 - Dashboard & Visualizations**
**Goal:** Give users visual insights into their finances.

- [ ] Dashboard widgets: *Total Income, Total Expense, Net Balance*  
- [ ] Graphs:
  - **Expense by Category (pie chart)**
  - **Spending Over Time (bar/line chart)**  
- [ ] "Top 5 Expenses" view with details

---

### **v0.5 - Import & Export (Excel / CSV)**
**Goal:** Make data portable and flexible.

- [ ] Export transactions to **Excel** or **CSV**  
- [ ] Exclude categories (e.g., *School Fees*) or choose a date range  
- [ ] Import Excel/CSV files with **custom column mapping**  
- [ ] Save user-defined "import profiles" (e.g., "Mum's Format")  

---

### **v0.6 - Bank Statement Import & Normalization**
**Goal:** Automate import of bank data (e.g., Lloyds Bank CSV).

- [ ] Upload statement -> parse -> normalize fields (`date, amount, description, counterparty`)  
- [ ] Detect direction (credit/debit)  
- [ ] Deduplicate existing transactions  
- [ ] Store source as `import:<profile>` in DynamoDB

---

### **v0.7 - Smart Categorization (Rules + AI)**
**Goal:** Let the system categorize automatically.

- [ ] Add **user rules engine** ("if description contains Uber -> Transport")  
- [ ] **AI suggestions** via Amazon Bedrock (Claude or Titan)  
- [ ] Display suggestions with one-click **Accept/Override**  
- [ ] Track suggestion accuracy per user

---

### **v0.8 - Performance & Search**
**Goal:** Scale to thousands of records efficiently.

- [ ] Add **GSI** for `date` and `category` queries  
- [ ] Add **pagination** support  
- [ ] Implement **search** (by counterparty, note, description)

---

### **v0.9 - DevOps, CI/CD & Reliability**
**Goal:** Production-grade automation.

- [ ] **Infrastructure as Code** with AWS CDK (TypeScript)
- [ ] **GitHub Actions** for test + deploy pipelines
- [ ] **CloudWatch Alarms** & **X-Ray Tracing**
- [ ] **AWS Budgets** cost alert setup

---

### **v1.0 - Polished Release**
**Goal:** Ship a feature-complete, user-ready cloud finance tracker.

- [ ] User settings (currency, default filters)
- [ ] Accessibility & responsive design polish
- [ ] Privacy tools (export/delete data)
- [ ] Demo data mode + landing page
- [ ] Add screenshots & demo video to README

---

##  Architecture

``` mermaid 
    flowchart LR
        A[React Frontend (Amplify)] -->|fetch| B(API Gateway HTTP)
        B --> C[Lambda (Python)]
        C --> D[(DynamoDB: finance-tx)]
        C --> E[(S3: Import/Export Files)]
        F((Amazon Bedrock)) --> C
        G((Cognito)) --> B
```
