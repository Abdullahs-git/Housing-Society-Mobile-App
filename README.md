# 📱 Housing Society Mobile App

A **React Native mobile application** for housing societies, built with **React Native + Firebase**, extending the Housing Society Web App.  
It enables **residents, buyers, and admins** to manage properties, request services, chat in realtime, and receive event alerts.

---

## 🚀 Features

### 👤 User Features

- 🔑 **Authentication** with Firebase
- 🏘️ **Property Listings** with details (price, location, owner info)
- 💰 **Buy & Sell Properties** (post & request listings)
- 🛠️ **Service Requests** (electrician, plumber, cleaner, etc.)
- 💬 **Community Chat** (realtime Firestore chat for residents)
- 📲 **WhatsApp Messaging** (direct contact with sellers/admins)
- 📜 **History Tracking** (property purchases & service requests)
- 📢 **Event Alerts** (push notifications for events/announcements)

### 🛠️ Admin Features

- 📋 **Dashboard** (mobile-friendly admin panel)
- ✅ **Approve/Reject Listings**
- 🧑‍🔧 **Manage Service Providers**
- 🏦 **Track Revenue & Transactions**
- 🔒 **Role-Based Access Control**

---

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo/CLI)
- **Backend & Database:** Firebase Authentication, Firestore
- **Realtime Chat:** Firestore Realtime Updates
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Integration:** WhatsApp API via `Linking.openURL()`

---

## 📌 Future Enhancements

- 📍 Google Maps for property locations
- 💳 Online payment integration (Stripe/Razorpay)
- 🧾 Automated billing for services & properties
- 📊 Advanced analytics & reports

---

## ⚡ Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Abdullahs-git/Housing-Society-Mobile-App.git
   cd Housing-Society-Mobile-App
   ## ⚡ Getting Started

   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up Firebase**

   - Add your Firebase config in `firebaseConfig.js`

4. **Run the app**
   ```bash
   npx expo start
   ```

## 📜 License

Licensed under the MIT License – free to use, modify, and distribute with attribution.
