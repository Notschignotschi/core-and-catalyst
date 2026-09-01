// 📡 CORE & CATALYST - ZENTRALE QUANTEN-DATENBRÜCKE (CLOUD VERSION)
import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, set, get, child } from "https://gstatic.com";

// ⚠️ ERSETZE DIESE DATEN MIT DEINEN EIGENEN FIREBASE PROJEKT-DATEN:
const firebaseConfig = {
    apiKey: "DEIN_API_KEY",
    authDomain: "DEIN_://firebaseapp.com",
    databaseURL: "https://DEIN_://firebaseio.com",
    projectId: "DEIN_PROJEKT",
    storageBucket: "DEIN_://appspot.com",
    messagingSenderId: "DEINE_ID",
    appId: "DEINE_APP_ID"
};

// Firebase & Datenbank initialisieren
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const DB = {
    // Holt den aktuell eingeloggten Commander aus der Session
    getActiveCommander: function() {
        return sessionStorage.getItem('active_commander') || "Gast_Commander";
    },

    // Generiert einen sicheren Pfad-Namen für die Datenbank
    getSafeKey: function(username) {
        return username.toLowerCase().replace(/[^a-z0-9]/g, "_");
    },

    // Registriert einen neuen Account direkt in der Cloud-DB
    registerUser: async function(username, password) {
        const safeKey = this.getSafeKey(username);
        const dbRef = ref(db);
        
        const snapshot = await get(child(dbRef, `accounts/${safeKey}`));
        if (snapshot.exists()) {
            throw new Error("Dieser Commander-Name existiert bereits!");
        }

        // Account und Standard-Startwerte anlegen
        await set(ref(db, 'accounts/' + safeKey), {
            name: username,
            password: password,
            credits: 0,
            speed: 900
        });
        
        sessionStorage.setItem('active_commander', username);
        return username;
    },

    // Prüft den Login direkt gegen die Cloud-DB
    loginUser: async function(username, password) {
        const safeKey = this.getSafeKey(username);
        const dbRef = ref(db);

        const snapshot = await get(child(dbRef, `accounts/${safeKey}`));
        if (!snapshot.exists()) {
            throw new Error("Commander im Senats-Register nicht gefunden!");
        }

        const userData = snapshot.val();
        if (userData.password !== password) {
            throw new Error("Ungültiger Zugangs-Code!");
        }

        sessionStorage.setItem('active_commander', userData.name);
        return userData.name;
    },

    // Lädt die Credits live aus der Cloud-DB (gibt ein Promise zurück)
    loadCredits: async function() {
        const commander = this.getActiveCommander();
        const safeKey = this.getSafeKey(commander);
        const dbRef = ref(db);
        
        const snapshot = await get(child(dbRef, `accounts/${safeKey}/credits`));
        return snapshot.exists() ? parseInt(snapshot.val()) : 0;
    },

    // Lädt die Geschwindigkeit live aus der Cloud-DB
    loadSpeed: async function() {
        const commander = this.getActiveCommander();
        const safeKey = this.getSafeKey(commander);
        const dbRef = ref(db);
        
        const snapshot = await get(child(dbRef, `accounts/${safeKey}/speed`));
        return snapshot.exists() ? parseInt(snapshot.val()) : 900;
    },

    // Speichert den Spielstand synchron in die Cloud-DB
    saveGame: async function(credits, speed) {
        const commander = this.getActiveCommander();
        const safeKey = this.getSafeKey(commander);
        
        await set(ref(db, `accounts/${safeKey}/credits`), credits);
        await set(ref(db, `accounts/${safeKey}/speed`), speed);
    }
};

// Macht das DB-Objekt global im Browser verfügbar
window.DB = DB;
