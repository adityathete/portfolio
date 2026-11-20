# 🚀 Step-by-Step Guide: Deploying Your AI Engineer Portfolio for Free

Welcome, **Aditya**! This guide is written specifically for your first time deploying a website. You do not need to install complicated software or pay a single rupee — everything described here is **100% free forever**.

---

## 📁 What is inside your website folder?

Your portfolio is built with modern, ultra-fast, zero-dependency web technologies:

```
My Profile/
├── index.html           # The main AI Engineer portfolio website
├── admin.html           # Your private Admin Panel (PIN protected)
├── data.json            # Master data file containing all your resume info
├── assets/
│   ├── css/
│   │   └── style.css    # Cyber/AI theme styles, glowing effects & animations
│   └── js/
│       ├── data.js      # Data manager & localStorage persistence logic
│       ├── main.js      # Interactive features (typing effect, AI simulator, filters)
│       └── admin.js     # Admin Panel CRUD logic, JSON export/import
├── DEPLOYMENT_GUIDE.md  # This step-by-step beginner guide
└── README.md            # Quick reference summary
```

---

## 💻 Step 1: Preview Your Website Locally on Your PC

Before publishing to the world, you can test it on your computer right now:

### Method A: Direct Double-Click (Easiest)
1. Open the folder `c:\Users\adith\OneDrive\Desktop\My Profile` in Windows File Explorer.
2. Double-click on `index.html`.
3. It will open directly in Google Chrome, Microsoft Edge, or Firefox.

### Method B: Using Python's Built-in Server (Recommended)
Since Python is already installed on your machine, you can run a local web server:
1. Open PowerShell or Command Prompt.
2. Run:
   ```powershell
   cd "c:\Users\adith\OneDrive\Desktop\My Profile"
   python -m http.server 8000
   ```
3. Open your browser and go to:
   **`http://localhost:8000`**
4. To view the Admin Panel locally, go to:
   **`http://localhost:8000/admin.html`**
   *(Default Admin PIN: `aditya2026`)*

---

## 🌐 Step 2: Choose Your Free Hosting Platform

Here are the two best free hosting options for your portfolio. **Option 1 (Netlify Drop)** requires no tools and takes less than 60 seconds!

---

### 🌟 Option 1: Netlify Drop (Easiest — No Git or Terminal Required, 60 Seconds)

Netlify is one of the world's top hosting platforms and offers a **free forever tier** with SSL (HTTPS) and lightning-fast speeds.

#### Step-by-Step Instructions:
1. Open your browser and go to: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. Sign up or log in (you can sign up with your Google account or GitHub account).
3. You will see a box that says: **"Drag and drop your site output folder here"**.
4. Open File Explorer to your desktop, and drag the entire **`My Profile`** folder right into that box on the browser page.
5. In 10 to 15 seconds, Netlify uploads your files and assigns you a live public link, like:
   `https://sweet-curie-81726a.netlify.app`
6. **Customize your site address**:
   - In your Netlify dashboard, click **"Site configuration"** (or **"Domain management"**).
   - Click **"Options"** -> **"Edit site name"**.
   - Change it to something professional like `aditya-thete-ai` or `adityathete-portfolio`.
   - Your website is now live at:
     **`https://aditya-thete-ai.netlify.app`** 🎉

---

### 🐙 Option 2: GitHub Pages (Best for AI Engineers & Developers)

Having your portfolio on GitHub Pages gives you a professional link (`yourusername.github.io`) that recruiters love to see.

#### Step-by-Step Instructions (Using the GitHub Website — No Git install needed!):
1. **Log in to GitHub**:
   - Go to **[https://github.com](https://github.com)** and sign in to your account (`adityathete`).
2. **Create a new repository**:
   - Click the green **"New"** button (or go to `https://github.com/new`).
   - Repository name:
     - If you want the site URL to be `https://adityathete.github.io`: name the repository **`adityathete.github.io`**.
     - OR name it **`portfolio`** (the URL will be `https://adityathete.github.io/portfolio`).
   - Keep it **Public**.
   - Check **"Add a README file"**.
   - Click **"Create repository"**.
3. **Upload your website files**:
   - In your newly created repository, click the **"Add file"** dropdown button near the top right and choose **"Upload files"**.
   - Drag and drop the following items from your `My Profile` folder:
     - `index.html`
     - `admin.html`
     - `data.json`
     - The whole `assets` folder (with `assets/css` and `assets/js`)
     - `DEPLOYMENT_GUIDE.md`
   - Wait for all files to finish uploading, then scroll down and click the green **"Commit changes"** button.
4. **Enable GitHub Pages**:
   - Click the **"Settings"** tab of your repository.
   - On the left sidebar, click **"Pages"**.
   - Under **"Build and deployment"** > **"Branch"**:
     - Change the branch from `None` to **`main`**.
     - Leave the folder as **`/ (root)`**.
     - Click **"Save"**.
5. **Your website is live**:
   - Wait about 60 to 90 seconds. Refresh the Settings > Pages tab.
   - You will see a banner: *"Your site is live at https://adityathete.github.io"*.
   - Click the link to open your live portfolio!

---

## 🛠️ Step 3: How to Use the Admin Panel to Edit Your Information

Your website has a dedicated Admin Panel accessible at:
- Locally: `admin.html` (or click the floating gear button at bottom-right)
- When live: `https://your-site.netlify.app/admin.html`

### 1. Logging in
- Open `admin.html`.
- Enter the default PIN: **`aditya2026`**
- Click **"Unlock Admin Portal"**.

### 2. What you can change:
- **Profile & Summary**: Edit your name, phone, email, bio summary, location, LinkedIn/GitHub URLs, and hero metrics (years experience, model accuracy, projects count).
- **Skills Matrix**: Add or remove skills within the 6 categories (Generative AI, LLMs, Vector DBs, NLP, Deep Learning, MLOps) or add a brand new category.
- **Projects**: Add new projects, edit titles, update RAGAS scores or accuracy metrics, edit bullet points, and change GitHub links.
- **Experience**: Add new roles, update company names, dates, achievements, and tech stack tags.
- **Education & Certifications**: Add degrees or new certifications.
- **Settings**: Change your admin PIN to a private code of your choice.

### 3. How to make changes permanent for all website visitors:
1. Make your edits in the Admin Panel.
2. Click the green **"Save Changes"** button at the top (this immediately updates the site in your browser).
3. Click the cyan **"Export data.json"** button. Your browser will download an updated `data.json` file.
4. Replace the old `data.json` in your repository or hosting folder:
   - **If using Netlify Drop**: Just drag the `My Profile` folder with the new `data.json` into Netlify again.
   - **If using GitHub Pages**: Go to your GitHub repository -> click on `data.json` -> click the pencil icon (or upload file) -> replace with the new file and click **"Commit changes"**.
5. Your live website is instantly updated for recruiters and visitors worldwide!

---

## 💡 Step 4: Optional - Connecting a Free Cloud Database (Supabase)

If you ever want your Admin Panel edits to save to the cloud automatically across all devices without having to re-upload `data.json`:
1. Create a free account at **[https://supabase.com](https://supabase.com)**.
2. Create a new project (it's 100% free).
3. In Supabase, create a table named `portfolio_data`.
4. Copy your Supabase Project URL and Anon Public Key.
5. You can paste them into your project to enable automatic two-way cloud sync anytime you want.

---

## 🏷️ Step 5: Optional - Adding a Custom Domain (`adityathete.com`)

If you decide to purchase your own domain later (from Namecheap, GoDaddy, or Cloudflare):
1. In Netlify or GitHub Pages, go to **"Domain settings"** or **"Custom domain"**.
2. Type in your domain name (e.g., `adityathete.com`).
3. Follow the 2-minute DNS guide provided on the screen (adding a CNAME record).
4. Netlify/GitHub automatically issues a free SSL certificate for HTTPS!

---

## ❓ Frequently Asked Questions (FAQ)

### Q: Do I have to pay anything for Netlify or GitHub Pages?
**A:** No. Both provide free tiers that are more than enough for a personal portfolio website with thousands of monthly visitors, free SSL certificates, and high speed.

### Q: What if I forget my Admin PIN?
**A:** Open `assets/js/data.js` or `data.json` on your PC, and you can see or change the PIN under `"adminPin": "your-new-pin"`.

### Q: Can recruiters test the AI chat simulator on mobile?
**A:** Yes! The entire site is 100% responsive and optimized for mobile phones, tablets, laptops, and desktops.

### Q: How do I change my resume link or contact info?
**A:** Go to the Admin Panel (`admin.html`), navigate to the **Profile & Summary** tab, change your email, phone, or links, and click **"Save Changes"**!

---

🎉 **You are all set! Follow Step 2 above to get your AI Engineer portfolio live in under 2 minutes!**
