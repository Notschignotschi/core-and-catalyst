// 📡 CORE & CATALYST - ZENTRALE QUANTEN-DATENBRÜCKE

const DB = {
    // Holt den aktuell eingeloggten Commander aus der Session
    getActiveCommander: function() {
        return sessionStorage.getItem('active_commander') || "Gast_Commander";
    },

    // Lädt die Credits spezifisch für den eingeloggten Account
    loadCredits: function() {
        const commander = this.getActiveCommander();
        const saved = localStorage.getItem('dc_credits_' + commander);
        return saved !== null ? parseInt(saved) : 2390000; // Standard-Startwert
    },

    // Lädt die Minen-Geschwindigkeit spezifisch für den Account
    loadSpeed: function() {
        const commander = this.getActiveCommander();
        const saved = localStorage.getItem('dc_speed_' + commander);
        return saved !== null ? parseInt(saved) : 900; // Standard +900/Sek
    },

    // Speichert den Spielstand exakt auf den Namen des Commanders
    saveGame: function(credits, speed) {
        const commander = this.getActiveCommander();
        localStorage.setItem('dc_credits_' + commander, credits);
        localStorage.setItem('dc_speed_' + commander, speed);
    }
};
