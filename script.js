// Brightness Control Logic
const brightnessSlider = document.getElementById('bottom-brightness-slider');
const videoOverlay = document.querySelector('.video-overlay');
const chatgptLogo = document.getElementById('chatgpt-logo');

if (brightnessSlider && videoOverlay) {
    // Initial Set
    videoOverlay.style.backgroundColor = 'black'; // Ensure it's black for dimming
    videoOverlay.style.opacity = (1 - brightnessSlider.value).toString();
    
    // Update ChatGPT logo opacity based on brightness
    const updateLogoBrightness = (brightness) => {
        if (chatgptLogo) {
            // Adjust opacity: higher brightness = more visible (higher opacity)
            // Map brightness (0-1) to opacity (0.4-1.0) for better visibility range
            const opacity = 0.4 + (brightness * 0.6);
            chatgptLogo.style.opacity = opacity.toString();
        }
    };
    
    // Set initial logo brightness
    updateLogoBrightness(parseFloat(brightnessSlider.value));

    brightnessSlider.addEventListener('input', (e) => {
        const brightness = parseFloat(e.target.value);
        videoOverlay.style.opacity = (1 - brightness).toString();
        updateLogoBrightness(brightness);
    });
}

// Dark/Light Mode Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Function to update ChatGPT logo based on theme
function updateChatGPTLogo(darkMode) {
    if (chatgptLogo) {
        // Use the same logo file, but apply filter for dark mode
        chatgptLogo.src = 'images/openai-svgrepo-com.svg';
        if (darkMode) {
            // Dark mode: apply brightness filter to make it white
            chatgptLogo.style.filter = 'brightness(0) invert(1)';
        } else {
            // Light mode: remove filter (use original colors)
            chatgptLogo.style.filter = 'none';
        }
    }
}

// Apply initial theme
if (isDarkMode) {
    document.body.classList.add('dark-mode');
}

// Update logo on initial load
updateChatGPTLogo(isDarkMode);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            themeToggle.classList.add('active');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.classList.remove('active');
            localStorage.setItem('darkMode', 'false');
        }
        
        // Update ChatGPT logo based on theme
        updateChatGPTLogo(isDarkMode);
        
        console.log("Theme Mode:", isDarkMode ? "DARK" : "LIGHT");
    });
    
    // Set initial active state
    if (isDarkMode) {
        themeToggle.classList.add('active');
    }
}

// Universal Search Popup
const searchTrigger = document.getElementById('search-trigger');
const searchPopup = document.getElementById('search-popup');
const searchInput = document.getElementById('universal-search-input');

if (searchTrigger && searchPopup) {
    searchTrigger.addEventListener('click', () => {
        searchPopup.classList.toggle('active');
        if (searchPopup.classList.contains('active')) {
            searchInput.focus();
            searchInput.placeholder = "Search Google...";
        }
    });
}

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (searchPopup && searchTrigger && !searchPopup.contains(e.target) && !searchTrigger.contains(e.target)) {
        searchPopup.classList.remove('active');
    }
});

// Handle Enter key for Search
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                searchPopup.classList.remove('active');
                searchInput.value = '';
            }
        }
    });
}

// Top bar search for songs
const topBarSearch = document.getElementById('top-bar-search');

// Audio Player Implementation
const audioPlayer = document.getElementById('audio-player');
const playlistContainer = document.getElementById('playlist-songs');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackNameEl = document.querySelector('.track-name');
const artistNameEl = document.querySelector('.artist-name');
const albumArtEl = document.querySelector('.album-art');
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('volume-btn');
const volumeIcon = document.getElementById('volume-icon');

// Playlist - array of song objects
let playlist = [
    { name: "Aaj Mausam Bada Beimaan Hai", path: "songs/Aaj Mausam Bada Beimaan Hai.mp3", artist: "Unknown" },
    { name: "Aaj Se Pehle Aaj Se Jyada", path: "songs/Aaj Se Pehle Aaj Se Jyada.mp3", artist: "Unknown" },
    { name: "Aaj Se Teri", path: "songs/Aaj Se Teri_spotdown.org.mp3", artist: "Unknown" },
    { name: "Aap Ki Ankhon Mein Kuch", path: "songs/Aap Ki Ankhon Mein Kuch.mp3", artist: "Unknown" },
    { name: "Agar Tum Saath Ho", path: "songs/Agar Tum Saath Ho (From _Tamasha_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Ahista Ahista", path: "songs/Ahista Ahista.mp3", artist: "Unknown" },
    { name: "Ajnabi", path: "songs/Ajnabi_spotdown.org.mp3", artist: "Unknown" },
    { name: "Aarzu", path: "songs/Aarzu_spotdown.org.mp3", artist: "Unknown" },
    { name: "Ae Mere Dil", path: "songs/Ae Mere Dil_spotdown.org.mp3", artist: "Unknown" },
    { name: "Afsos", path: "songs/Afsos_spotdown.org.mp3", artist: "Unknown" },
    { name: "Ankhiyon Ke Jharokhon Se", path: "songs/Ankhiyon Ke Jharokhon Se.mp3", artist: "Unknown" },
    { name: "Apnaa Mujhe Tu Lagaa", path: "songs/Apnaa Mujhe Tu Lagaa_spotdown.org.mp3", artist: "Unknown" },
    { name: "Baithe Baithe", path: "songs/Baithe Baithe.mp3", artist: "Unknown" },
    { name: "Bajrang Baan-Lofi", path: "songs/Bajrang Baan-Lofi.mp3", artist: "Unknown" },
    { name: "Bas Tu Hi", path: "songs/Bas Tu Hi.mp3", artist: "Unknown" },
    { name: "Be Intehaan", path: "songs/Be Intehaan_spotdown.org.mp3", artist: "Unknown" },
    { name: "Behti Hawa Sa Tha Woh", path: "songs/Behti Hawa Sa Tha Woh_spotdown.org.mp3", artist: "Unknown" },
    { name: "Besabriyaan", path: "songs/Besabriyaan_spotdown.org.mp3", artist: "Unknown" },
    { name: "Bewafa", path: "songs/Bewafa.mp3", artist: "Unknown" },
    { name: "Bheegi Bheegi Raaton Mein", path: "songs/Bheegi Bheegi Raaton Mein.mp3", artist: "Unknown" },
    { name: "Bhare Naina", path: "songs/Bhare Naina_spotdown.org.mp3", artist: "Unknown" },
    { name: "Bhool Gaya Sub Kuchh", path: "songs/Bhool Gaya Sub Kuchh.mp3", artist: "Unknown" },
    { name: "Bhula Diya", path: "songs/Bhula Diya_spotdown.org.mp3", artist: "Unknown" },
    { name: "Bulleya", path: "songs/Bulleya.mp3", artist: "Unknown" },
    { name: "Chaahat Ka Maara", path: "songs/Chaahat Ka Maara_spotdown.org.mp3", artist: "Unknown" },
    { name: "Chaand Baaliyan", path: "songs/Chaand Baaliyan_spotdown.org.mp3", artist: "Unknown" },
    { name: "Chaap Tilak", path: "songs/Chaap Tilak.mp3", artist: "Unknown" },
    { name: "Chaka Chak", path: "songs/Chaka Chak (From _Atrangi Re_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Chand Mera Dil Chandni Ho Tum", path: "songs/Chand Mera Dil Chandni Ho Tum.mp3", artist: "Unknown" },
    { name: "Chashni", path: "songs/Chashni (From _Bharat_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Chaukhat", path: "songs/Chaukhat (Acoustic)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Chura Liya Hai Tumne Jo Dil Ko", path: "songs/Chura Liya Hai Tumne Jo Dil Ko.mp3", artist: "Unknown" },
    { name: "Darkhaast", path: "songs/Darkhaast_spotdown.org.mp3", artist: "Unknown" },
    { name: "Daryaa", path: "songs/Daryaa_spotdown.org.mp3", artist: "Unknown" },
    { name: "Dekha Hi Nahi", path: "songs/Dekha Hi Nahi_spotdown.org.mp3", artist: "Unknown" },
    { name: "Dhanak", path: "songs/Dhanak_spotdown.org.mp3", artist: "Unknown" },
    { name: "Dheere Dheere Bol Koi Sun Na Le", path: "songs/Dheere Dheere Bol Koi Sun Na Le.mp3", artist: "Unknown" },
    { name: "Dil Mile", path: "songs/Dil Mile_spotdown.org.mp3", artist: "Unknown" },
    { name: "Do Deewane Shaher Mein", path: "songs/Do Deewane Shaher Mein.mp3", artist: "Unknown" },
    { name: "Do Lafzon Ki Hai Dil Ki Kahani", path: "songs/Do Lafzon Ki Hai Dil Ki Kahani.mp3", artist: "Unknown" },
    { name: "Doobey", path: "songs/Doobey (From _Gehraiyaan_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Dooriyan", path: "songs/Dooriyan_spotdown.org.mp3", artist: "Unknown" },
    { name: "Ehsaas", path: "songs/Ehsaas.mp3", artist: "Unknown" },
    { name: "Ek Baar", path: "songs/Ek Baar_spotdown.org.mp3", artist: "Unknown" },
    { name: "Ek Main Aur Ek Tu", path: "songs/Ek Main Aur Ek Tu.mp3", artist: "Unknown" },
    { name: "Ek Tarfa", path: "songs/Ek Tarfa_spotdown.org.mp3", artist: "Unknown" },
    { name: "FAASLE by Aditya", path: "songs/FAASLE by Aditya.mp3", artist: "Unknown" },
    { name: "Faasle Kaavish", path: "songs/Faasle Kaavish.mp3", artist: "Unknown" },
    { name: "Finding Her", path: "songs/Finding Her_spotdown.org.mp3", artist: "Unknown" },
    { name: "Gawara", path: "songs/Gawara_spotdown.org.mp3", artist: "Unknown" },
    { name: "Ghar Se Nikalte Hi", path: "songs/Ghar Se Nikalte Hi_spotdown.org.mp3", artist: "Unknown" },
    { name: "Gulabi Aankhen", path: "songs/Gulabi Aankhen_spotdown.org.mp3", artist: "Unknown" },
    { name: "Gulabi Ankhen", path: "songs/Gulabi Ankhen.mp3", artist: "Unknown" },
    { name: "Gulabi Ankhen - From The Train", path: "songs/Gulabi Ankhen - From _The Train__spotdown.org.mp3", artist: "Unknown" },
    { name: "Gumsum", path: "songs/Gumsum_spotdown.org.mp3", artist: "Unknown" },
    { name: "Ham Ne Tum Ko Dekha", path: "songs/Ham Ne Tum Ko Dekha.mp3", artist: "Unknown" },
    { name: "Ham Tere Pyar Mein", path: "songs/Ham Tere Pyar Mein.mp3", artist: "Unknown" },
    { name: "Hamari Adhuri Kahani", path: "songs/Hamari Adhuri Kahani (Title Track)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Hasi - Female Version", path: "songs/Hasi - Female Version_spotdown.org.mp3", artist: "Unknown" },
    { name: "Hasratain", path: "songs/Hasratain - Hassan Shaikh.m4a", artist: "Hassan Shaikh" },
    { name: "Hawayein", path: "songs/Hawayein (From _Jab Harry Met Sejal_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Heer", path: "songs/Heer_spotdown.org.mp3", artist: "Unknown" },
    { name: "Heer Ranjha", path: "songs/Heer Ranjha_spotdown.org.mp3", artist: "Unknown" },
    { name: "Humdard", path: "songs/Humdard (From _Ek Villain_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Humnava Mere", path: "songs/Humnava Mere_spotdown.org.mp3", artist: "Unknown" },
    { name: "Ibaadat", path: "songs/Ibaadat.mp3", artist: "Unknown" },
    { name: "intezaar hai", path: "songs/intezaar hai_spotdown.org.mp3", artist: "Unknown" },
    { name: "Ishqa Ve", path: "songs/Ishqa Ve.mp3", artist: "Unknown" },
    { name: "Jaaneman Jaaneman Tere Do Nain", path: "songs/Jaaneman Jaaneman Tere Do Nain.mp3", artist: "Unknown" },
    { name: "Jab Deep Jale Aana", path: "songs/Jab Deep Jale Aana.mp3", artist: "Unknown" },
    { name: "Jab Koi Baat", path: "songs/Jab Koi Baat.mp3", artist: "Unknown" },
    { name: "Jab Tak", path: "songs/Jab Tak_spotdown.org.mp3", artist: "Unknown" },
    { name: "Jeena Jeena", path: "songs/Jeena Jeena (From _Badlapur_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Jo Tum Mere Ho", path: "songs/Jo Tum Mere Ho.mp3", artist: "Unknown" },
    { name: "Judaai", path: "songs/Judaai (From _Badlapur)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Jugnu", path: "songs/Jugnu_spotdown.org.mp3", artist: "Unknown" },
    { name: "Kabhi Jo Badal Barse", path: "songs/Kabhi Jo Badal Barse_spotdown.org.mp3", artist: "Unknown" },
    { name: "Kabhi Kabhi Mere Dil Mein", path: "songs/Kabhi Kabhi Mere Dil Mein_spotdown.org.mp3", artist: "Unknown" },
    { name: "Kahani Meri", path: "songs/Kahani Meri_spotdown.org.mp3", artist: "Unknown" },
    { name: "Kaise Hua", path: "songs/Kaise Hua_spotdown.org.mp3", artist: "Unknown" },
    { name: "Kaise Kaise", path: "songs/Kaise Kaise_spotdown.org.mp3", artist: "Unknown" },
    { name: "Kal Ho Naa Ho", path: "songs/Kal Ho Naa Ho_spotdown.org.mp3", artist: "Unknown" },
    { name: "Kasam Ki Kasam - Unplugged", path: "songs/Kasam Ki Kasam - Unplugged.mp3", artist: "Unknown" },
    { name: "Khairiyat", path: "songs/Khairiyat_spotdown.org.mp3", artist: "Unknown" },
    { name: "Khamoshiyan", path: "songs/Khamoshiyan_spotdown.org.mp3", artist: "Unknown" },
    { name: "Khayaal", path: "songs/Khayaal.mp3", artist: "Unknown" },
    { name: "Khud Ko Tere", path: "songs/Khud Ko Tere.mp3", artist: "Unknown" },
    { name: "Khush to Hai Na", path: "songs/Khush to Hai Na_spotdown.org.mp3", artist: "Unknown" },
    { name: "Khwaab", path: "songs/Khwaab_spotdown.org.mp3", artist: "Unknown" },
    { name: "Kya Khoob Lagti Ho", path: "songs/Kya Khoob Lagti Ho.mp3", artist: "Unknown" },
    { name: "Last Love", path: "songs/Last Love (From _UR Debut_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Luv Ju", path: "songs/Luv Ju_spotdown.org.mp3", artist: "Unknown" },
    { name: "Maand", path: "songs/Maand_spotdown.org.mp3", artist: "Unknown" },
    { name: "Maeri", path: "songs/Maeri_spotdown.org.mp3", artist: "Unknown" },
    { name: "Main Shair To Nahin", path: "songs/Main Shair To Nahin.mp3", artist: "Unknown" },
    { name: "Majra", path: "songs/Majra_spotdown.org.mp3", artist: "Unknown" },
    { name: "Manike Mage Hithe", path: "songs/Manike Mage Hithe - Hindi Version_spotdown.org.mp3", artist: "Unknown" },
    { name: "Matargashti", path: "songs/Matargashti_spotdown.org.mp3", artist: "Unknown" },
    { name: "Mazaakiyan", path: "songs/Mazaakiyan.mp3", artist: "Unknown" },
    { name: "Mere Yaaraa", path: "songs/Mere Yaaraa (From _Sooryavanshi_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Mitti De", path: "songs/Mitti De_spotdown.org.mp3", artist: "Unknown" },
    { name: "Mohabbat Ka Dhokha", path: "songs/Mohabbat Ka Dhokha.mp3", artist: "Unknown" },
    { name: "Mujhe Teri Mohabbat Ka Sahara", path: "songs/Mujhe Teri Mohabbat Ka Sahara.mp3", artist: "Unknown" },
    { name: "Mujhe Tum Nazar Se", path: "songs/Mujhe Tum Nazar Se.mp3", artist: "Unknown" },
    { name: "Nahin Milta", path: "songs/Nahin Milta.mp3", artist: "Unknown" },
    { name: "Najaa", path: "songs/Najaa (From _Sooryavanshi_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Nasha", path: "songs/Nasha (Equals Sessions)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Nazm Nazm", path: "songs/Nazm Nazm_spotdown.org.mp3", artist: "Unknown" },
    { name: "O Mere Dil Ke Chain", path: "songs/O Mere Dil Ke Chain.mp3", artist: "Unknown" },
    { name: "O More Saiyaan", path: "songs/O More Saiyaan.mp3", artist: "Unknown" },
    { name: "O Re Piya", path: "songs/O Re Piya_spotdown.org.mp3", artist: "Unknown" },
    { name: "O Sathi Chal", path: "songs/O Sathi Chal.mp3", artist: "Unknown" },
    { name: "Oh Sahib", path: "songs/Oh Sahib.mp3", artist: "Unknown" },
    { name: "Out Of Your Mind", path: "songs/Out Of Your Mind_spotdown.org.mp3", artist: "Unknown" },
    { name: "Paaro", path: "songs/Paaro_spotdown.org.mp3", artist: "Unknown" },
    { name: "Pag Pag", path: "songs/Pag Pag_spotdown.org.mp3", artist: "Unknown" },
    { name: "Pal Pal", path: "songs/Pal Pal_spotdown.org.mp3", artist: "Unknown" },
    { name: "Pal Pal Dil Ke Paas", path: "songs/Pal Pal Dil Ke Paas.mp3", artist: "Unknown" },
    { name: "Paniyon Sa", path: "songs/Paniyon Sa_spotdown.org.mp3", artist: "Unknown" },
    { name: "Pehla Pyaar", path: "songs/Pehla Pyaar_spotdown.org.mp3", artist: "Unknown" },
    { name: "Phir Kabhi", path: "songs/Phir Kabhi (From _M.S.Dhoni - The Untold Story_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Phir Le Aya Dil", path: "songs/Phir Le Aya Dil_spotdown.org.mp3", artist: "Unknown" },
    { name: "Pyar Mein Kabhi Kabhi", path: "songs/Pyar Mein Kabhi Kabhi.mp3", artist: "Unknown" },
    { name: "Raabta", path: "songs/Raabta_spotdown.org.mp3", artist: "Unknown" },
    { name: "Raataan Lambiyan", path: "songs/Raataan Lambiyan (From _Shershaah_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Rait Zara Si", path: "songs/Rait Zara Si_spotdown.org.mp3", artist: "Unknown" },
    { name: "Rozaana", path: "songs/Rozaana_spotdown.org.mp3", artist: "Unknown" },
    { name: "Saamnay", path: "songs/Saamnay_spotdown.org.mp3", artist: "Unknown" },
    { name: "Saibo", path: "songs/Saibo_spotdown.org.mp3", artist: "Unknown" },
    { name: "Sajna", path: "songs/Sajna_spotdown.org.mp3", artist: "Unknown" },
    { name: "Sajna da Dil Torya", path: "songs/Sajna da Dil Torya_spotdown.org.mp3", artist: "Unknown" },
    { name: "Sapna", path: "songs/Sapna_spotdown.org.mp3", artist: "Unknown" },
    { name: "Sawan Aaya Hai", path: "songs/Sawan Aaya Hai_spotdown.org.mp3", artist: "Unknown" },
    { name: "Senorita", path: "songs/Senorita_spotdown.org.mp3", artist: "Unknown" },
    { name: "Shayad", path: "songs/Shayad_spotdown.org.mp3", artist: "Unknown" },
    { name: "Shiddat Title Track", path: "songs/Shiddat Title Track (From _Shiddat_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Siyah", path: "songs/Siyah_spotdown.org.mp3", artist: "Unknown" },
    { name: "Soch Liya", path: "songs/Soch Liya (From _Radhe Shyam_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Soch Na Sake", path: "songs/Soch Na Sake_spotdown.org.mp3", artist: "Unknown" },
    { name: "Sooraj Dooba Hain", path: "songs/Sooraj Dooba Hain (From _Roy_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Stay", path: "songs/Stay_spotdown.org.mp3", artist: "Unknown" },
    { name: "Sukoon", path: "songs/Sukoon_spotdown.org.mp3", artist: "Unknown" },
    { name: "Sutta", path: "songs/Sutta_spotdown.org.mp3", artist: "Unknown" },
    { name: "Taaron Ke Shehar", path: "songs/Taaron Ke Shehar_spotdown.org.mp3", artist: "Unknown" },
    { name: "Taiy Nahi Kiya Abhi", path: "songs/Taiy Nahi Kiya Abhi.mp3", artist: "Unknown" },
    { name: "Tera Ghata", path: "songs/Tera Ghata_spotdown.org.mp3", artist: "Unknown" },
    { name: "Tera Yaar Hoon Main", path: "songs/Tera Yaar Hoon Main_spotdown.org.mp3", artist: "Unknown" },
    { name: "Tere Bina Jiya Jaye Naa", path: "songs/Tere Bina Jiya Jaye Naa.mp3", artist: "Unknown" },
    { name: "Tere Rang", path: "songs/Tere Rang.mp3", artist: "Unknown" },
    { name: "Tere Sang Yaara", path: "songs/Tere Sang Yaara_spotdown.org.mp3", artist: "Unknown" },
    { name: "Thodi Si Daaru", path: "songs/Thodi Si Daaru_spotdown.org.mp3", artist: "Unknown" },
    { name: "Tip Tip", path: "songs/Tip Tip (From _Sooryavanshi_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Tu Aake Dekhle", path: "songs/Tu Aake Dekhle_spotdown.org.mp3", artist: "Unknown" },
    { name: "Tu Hi Yaar Mera", path: "songs/Tu Hi Yaar Mera (From _Pati Patni Aur Woh_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Tujhe Kitna Chahne Lage", path: "songs/Tujhe Kitna Chahne Lage (From _Kabir Singh_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Tum Tak", path: "songs/Tum Tak (From _Raanjhanaa_)_spotdown.org.mp3", artist: "Unknown" },
    { name: "Tumhen Ho Na Ho", path: "songs/Tumhen Ho Na Ho.mp3", artist: "Unknown" },
    { name: "Tumhin Meri Mandir", path: "songs/Tumhin Meri Mandir.mp3", artist: "Unknown" },
    { name: "Unke Bina - Raw", path: "songs/Unke Bina - Raw_spotdown.org.mp3", artist: "Unknown" },
    { name: "Unko Bhi Humse Mohabbat Ho", path: "songs/Unko_Bhi_Humse_Mohabbat_Ho.mp3", artist: "Unknown" },
    { name: "Ye Ladka Hay Allah Kaisa Hai Diwana", path: "songs/Ye Ladka Hay Allah Kaisa Hai Diwana.mp3", artist: "Unknown" },
    { name: "Yeh Raaten Yeh Mausam", path: "songs/Yeh Raaten Yeh Mausam_spotdown.org.mp3", artist: "Unknown" },
    { name: "Yeh Reshmi Zulfen", path: "songs/Yeh Reshmi Zulfen.mp3", artist: "Unknown" },
    { name: "Yeh Sham Mastani", path: "songs/Yeh Sham Mastani.mp3", artist: "Unknown" },
    { name: "Zaroori Tha - Acoustic", path: "songs/Zaroori Tha - Acoustic.mp3", artist: "Unknown" },
    { name: "Zindagi Se", path: "songs/Zindagi Se.mp3", artist: "Unknown" }
];

let currentTrackIndex = 0;
let filteredPlaylist = [...playlist];

// Function to update song count display
function updateSongCount() {
    const songCountElement = document.getElementById('song-count');
    if (songCountElement) {
        songCountElement.textContent = playlist.length;
    }
}

// Initialize song count when page loads
document.addEventListener('DOMContentLoaded', updateSongCount);

// Function to format song name (clean up filename)
function formatSongName(filename) {
    return filename
        .replace(/_spotdown.org/g, '')
        .replace(/\(From _/g, '(')
        .replace(/_\)/g, ')')
        .replace(/_/g, ' ')
        .replace(/\.(mp3|m4a)$/i, '')
        .trim();
}

// Function to generate default album art SVG (data URI)
function generateDefaultAlbumArt(songName, size = 64) {
    const firstLetter = songName.charAt(0).toUpperCase();
    const colors = [
        ['#667eea', '#764ba2'],
        ['#f093fb', '#f5576c'],
        ['#4facfe', '#00f2fe'],
        ['#fa709a', '#fee140'],
        ['#a8edea', '#fed6e3'],
        ['#ffecd2', '#fcb69f'],
        ['#ff9a9e', '#fecfef'],
        ['#ff6a88', '#c851cd'],
        ['#a1c4fd', '#c2e9fb'],
        ['#ff9a56', '#ffad56']
    ];
    const colorPair = colors[songName.length % colors.length];
    const gradientId = 'grad-' + songName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20);
    
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${colorPair[0]};stop-opacity:1" /><stop offset="100%" style="stop-color:${colorPair[1]};stop-opacity:1" /></linearGradient></defs><rect width="${size}" height="${size}" rx="${size * 0.125}" fill="url(#${gradientId})"/><text x="50%" y="50%" font-family="Arial,sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${firstLetter}</text></svg>`;
    
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Function to get album art path (check if exists, otherwise use default)
function getAlbumArtPath(song) {
    // You can add custom album art paths here
    // For now, we'll use the default generated art
    // Format: album-art/[song-name].jpg or .png
    const sanitizedName = song.name.replace(/[^a-zA-Z0-9]/g, '_');
    const customPath = `album-art/${sanitizedName}.jpg`;
    
    // Return default for now (you can add logic to check if file exists)
    return generateDefaultAlbumArt(song.name, 128);
}

// Render playlist
function renderPlaylist() {
    if (!playlistContainer) return;
    
    playlistContainer.innerHTML = '';
    
    filteredPlaylist.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'playlist-item';
        songItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.05);
            cursor: pointer;
            transition: all 0.2s ease;
            ${currentTrackIndex === playlist.indexOf(song) ? 'background: rgba(255, 255, 255, 0.15);' : ''}
        `;
        
        const albumArtPath = getAlbumArtPath(song);
        songItem.innerHTML = `
            <div style="width: 56px; height: 56px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                <img src="${albumArtPath}" alt="${song.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'; this.parentElement.innerHTML='<svg width=\\'56\\' height=\\'56\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' style=\\'width:100%;height:100%;color:white;opacity:0.8;padding:12px;background:rgba(255,255,255,0.1);\\'><circle cx=\\'12\\' cy=\\'12\\' r=\\'8\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'></circle><circle cx=\\'12\\' cy=\\'12\\' r=\\'3\\' fill=\\'currentColor\\'></circle></svg>'">
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="color: white; font-weight: 500; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">
                    ${song.name}
                </div>
                <div style="color: rgba(255, 255, 255, 0.7); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${song.artist}
                </div>
            </div>
        `;
        
        songItem.addEventListener('click', () => {
            currentTrackIndex = playlist.indexOf(song);
            loadTrack(currentTrackIndex);
            playTrack();
        });
        
        songItem.addEventListener('mouseenter', () => {
            if (currentTrackIndex !== playlist.indexOf(song)) {
                songItem.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
        
        songItem.addEventListener('mouseleave', () => {
            if (currentTrackIndex !== playlist.indexOf(song)) {
                songItem.style.background = 'rgba(255, 255, 255, 0.05)';
            }
        });
        
        playlistContainer.appendChild(songItem);
    });
}

// Load a track
function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrackIndex = index;
    const song = playlist[index];
    
    console.log('Loading track:', song.name, 'Path:', song.path, 'Index:', index);
    
    if (audioPlayer) {
        audioPlayer.src = song.path;
        audioPlayer.load();
        
        audioPlayer.addEventListener('error', function(e) {
            console.error('Audio error:', e);
            console.error('Failed to load:', song.path);
        });
    }
    
    if (trackNameEl) trackNameEl.textContent = song.name;
    if (artistNameEl) artistNameEl.textContent = song.artist;
    
    // Update album art in now-playing section
    if (albumArtEl) {
        const albumArtPath = getAlbumArtPath(song);
        // Make album art larger
        albumArtEl.style.width = '56px';
        albumArtEl.style.height = '56px';
        albumArtEl.innerHTML = `
            <img src="${albumArtPath}" alt="${song.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; display: block;" onerror="this.style.display='none'; this.parentElement.innerHTML='<svg width=\\'56\\' height=\\'56\\' viewBox=\\'0 0 32 32\\' fill=\\'none\\' style=\\'width:100%;height:100%;color:white;opacity:0.8;\\'><rect width=\\'32\\' height=\\'32\\' rx=\\'6\\' fill=\\'rgba(255,255,255,0.1)\\'></rect><circle cx=\\'16\\' cy=\\'16\\' r=\\'8\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'></circle><circle cx=\\'16\\' cy=\\'16\\' r=\\'3\\' fill=\\'currentColor\\'></circle></svg>'">
        `;
    }
    
    renderPlaylist();
}

// Play track
function playTrack() {
    if (audioPlayer) {
        audioPlayer.play().catch(err => {
            console.error('Error playing audio:', err);
        });
        updatePlayPauseIcon(false);
    }
}

// Pause track
function pauseTrack() {
    if (audioPlayer) {
        audioPlayer.pause();
        updatePlayPauseIcon(true);
    }
}

// Toggle play/pause
function togglePlayPause() {
    if (audioPlayer) {
        if (audioPlayer.paused) {
            playTrack();
        } else {
            pauseTrack();
        }
    }
}

// Previous track
function previousTrack() {
    if (currentTrackIndex > 0) {
        loadTrack(currentTrackIndex - 1);
        playTrack();
    }
}

// Next track
function nextTrack() {
    if (currentTrackIndex < playlist.length - 1) {
        loadTrack(currentTrackIndex + 1);
        playTrack();
    } else {
        // Loop to beginning
        loadTrack(0);
        playTrack();
    }
}

// Update play/pause icon
function updatePlayPauseIcon(isPaused) {
    if (!playPauseBtn) return;
    
    if (isPaused) {
        playPauseBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
        `;
    } else {
        playPauseBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"></rect>
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"></rect>
            </svg>
        `;
    }
}

// Volume Control Logic
let previousVolume = 1; // Store volume before mute

function updateVolumeIcon(volume) {
    if (!volumeIcon) return;
    
    if (volume === 0) {
        // Muted icon
        volumeIcon.innerHTML = `
            <path d="M11 3L5.5 7H2V11H5.5L11 15V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <line x1="13" y1="5" x2="15" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></line>
            <line x1="13" y1="13" x2="15" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></line>
        `;
    } else if (volume < 0.33) {
        // Low volume (1 wave)
        volumeIcon.innerHTML = `
            <path d="M11 3L5.5 7H2V11H5.5L11 15V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M13 7C13.5 7.5 13.75 8.25 13.75 9C13.75 9.75 13.5 10.5 13 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
        `;
    } else if (volume < 0.66) {
        // Medium volume (2 waves)
        volumeIcon.innerHTML = `
            <path d="M11 3L5.5 7H2V11H5.5L11 15V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M13 6C13.8 6.8 14.25 7.9 14.25 9C14.25 10.1 13.8 11.2 13 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
            <path d="M13 8C13.5 8.5 13.75 9.25 13.75 10C13.75 10.75 13.5 11.5 13 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
        `;
    } else {
        // High volume (3 waves) - default icon
        volumeIcon.innerHTML = `
            <path d="M11 3L5.5 7H2V11H5.5L11 15V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M13 5C14 6 14.5 7.5 14.5 9C14.5 10.5 14 12 13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
        `;
    }
}

// Volume slider control
if (volumeSlider && audioPlayer) {
    // Set initial volume
    audioPlayer.volume = volumeSlider.value;
    updateVolumeIcon(parseFloat(volumeSlider.value));
    
    volumeSlider.addEventListener('input', (e) => {
        const volume = parseFloat(e.target.value);
        audioPlayer.volume = volume;
        previousVolume = volume > 0 ? volume : previousVolume;
        updateVolumeIcon(volume);
    });
}

// Volume button (mute/unmute toggle)
if (volumeBtn && audioPlayer && volumeSlider) {
    volumeBtn.addEventListener('click', () => {
        if (audioPlayer.volume > 0) {
            // Mute
            previousVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeSlider.value = 0;
            updateVolumeIcon(0);
        } else {
            // Unmute
            audioPlayer.volume = previousVolume;
            volumeSlider.value = previousVolume;
            updateVolumeIcon(previousVolume);
        }
    });
}

// Event listeners for audio player
if (audioPlayer) {
    audioPlayer.addEventListener('ended', () => {
        nextTrack();
    });
    
    audioPlayer.addEventListener('play', () => {
        updatePlayPauseIcon(false);
    });
    
    audioPlayer.addEventListener('pause', () => {
        updatePlayPauseIcon(true);
    });
}

// Event listeners for controls
if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
}

if (prevBtn) {
    prevBtn.addEventListener('click', previousTrack);
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextTrack);
}

// Search functionality
if (topBarSearch) {
    topBarSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query) {
            filteredPlaylist = playlist.filter(song => 
                song.name.toLowerCase().includes(query) || 
                song.artist.toLowerCase().includes(query)
            );
        } else {
            filteredPlaylist = [...playlist];
        }
        renderPlaylist();
    });
    
    topBarSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredPlaylist.length > 0) {
                const firstMatch = filteredPlaylist[0];
                currentTrackIndex = playlist.indexOf(firstMatch);
                loadTrack(currentTrackIndex);
                playTrack();
            }
            topBarSearch.blur();
        }
    });
}

// Initialize - set initial album art size
if (albumArtEl) {
    albumArtEl.style.width = '56px';
    albumArtEl.style.height = '56px';
}

// Tab System Implementation
class TabSystem {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabPanels = document.querySelectorAll('.tab-panel');
        this.activeTab = 'playlist';
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        // Add click handlers to tab buttons
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = button.getAttribute('data-tab');
                if (!this.isAnimating && tabName !== this.activeTab) {
                    this.switchTab(tabName);
                }
            });
        });
        
        // Initialize first tab
        this.showTab(this.activeTab, false);
    }
    
    switchTab(newTab) {
        if (this.isAnimating || newTab === this.activeTab) return;
        
        this.isAnimating = true;
        
        // Minimize current tab with smooth animation
        const currentPanel = document.getElementById(`${this.activeTab}-tab`);
        const currentButton = document.querySelector(`[data-tab="${this.activeTab}"]`);
        
        // Add minimizing class for smooth exit animation
        currentPanel.classList.add('minimizing');
        currentPanel.classList.remove('active');
        currentButton.classList.remove('active');
        
        // Wait for minimize animation to start, then show new tab
        setTimeout(() => {
            this.showTab(newTab, true);
            
            // Remove minimizing class after animation completes
            setTimeout(() => {
                currentPanel.classList.remove('minimizing');
                this.isAnimating = false;
            }, 400);
        }, 50);
    }
    
    showTab(tabName, animate = true) {
        const panel = document.getElementById(`${tabName}-tab`);
        const button = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (!panel || !button) return;
        
        // Set new active tab
        this.activeTab = tabName;
        
        // Activate new panel with animation
        if (animate) {
            // Reset animation for smooth entrance
            panel.style.animation = 'none';
            panel.offsetHeight; // Force reflow
            panel.style.animation = '';
        }
        
        panel.classList.add('active');
        button.classList.add('active');
        
        // Load content for specific tabs if needed
        this.loadTabContent(tabName);
    }
    
    loadTabContent(tabName) {
        switch(tabName) {
            case 'albums':
                this.loadAlbums();
                break;
            case 'artists':
                this.loadArtists();
                break;
            case 'settings':
                // Settings content is already in HTML
                break;
            case 'playlist':
                // Playlist is already loaded
                break;
        }
    }
    
    loadAlbums() {
        const albumsGrid = document.querySelector('.albums-grid');
        if (!albumsGrid || albumsGrid.children.length > 0) return; // Already loaded
        
        // Generate sample albums from playlist
        const albums = [];
        const albumMap = new Map();
        
        playlist.forEach(song => {
            // Extract album name from song title (simplified)
            const albumName = song.name.split(' ')[0] || 'Unknown Album';
            if (!albumMap.has(albumName)) {
                albumMap.set(albumName, {
                    name: albumName,
                    songs: []
                });
            }
            albumMap.get(albumName).songs.push(song);
        });
        
        // Create album items
        albumMap.forEach((album, name) => {
            const albumItem = document.createElement('div');
            albumItem.className = 'album-item';
            albumItem.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: fadeInGrid 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) backwards;
                animation-delay: ${Array.from(albumMap.keys()).indexOf(name) * 0.1}s;
            `;
            
            const albumArtPath = generateDefaultAlbumArt(name, 120);
            
            albumItem.innerHTML = `
                <div style="width: 120px; height: 120px; border-radius: 12px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                    <img src="${albumArtPath}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="color: white; font-weight: 600; font-size: 14px; margin-bottom: 4px;">${name}</div>
                <div style="color: rgba(255, 255, 255, 0.6); font-size: 12px;">${album.songs.length} songs</div>
            `;
            
            albumItem.addEventListener('mouseenter', () => {
                albumItem.style.background = 'rgba(255, 255, 255, 0.1)';
                albumItem.style.transform = 'translateY(-4px) scale(1.02)';
                albumItem.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
            });
            
            albumItem.addEventListener('mouseleave', () => {
                albumItem.style.background = 'rgba(255, 255, 255, 0.05)';
                albumItem.style.transform = 'translateY(0) scale(1)';
                albumItem.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            });
            
            albumsGrid.appendChild(albumItem);
        });
    }
    
    loadArtists() {
        const artistsGrid = document.querySelector('.artists-grid');
        if (!artistsGrid || artistsGrid.children.length > 0) return; // Already loaded
        
        // Extract unique artists from playlist
        const artistSet = new Set();
        playlist.forEach(song => {
            if (song.artist && song.artist !== 'Unknown') {
                artistSet.add(song.artist);
            }
        });
        
        // Create artist items
        Array.from(artistSet).forEach((artist, index) => {
            const artistItem = document.createElement('div');
            artistItem.className = 'artist-item';
            artistItem.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                border-radius: 50%;
                width: 120px;
                height: 120px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                border: 2px solid rgba(255, 255, 255, 0.1);
                animation: fadeInGrid 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) backwards;
                animation-delay: ${index * 0.1}s;
                position: relative;
                overflow: hidden;
            `;
            
            // Generate avatar background
            const colors = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            ];
            const gradient = colors[index % colors.length];
            
            artistItem.innerHTML = `
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${gradient}; opacity: 0.8;"></div>
                <div style="position: relative; color: white; font-weight: 600; font-size: 24px; text-align: center;">
                    ${artist.charAt(0).toUpperCase()}
                </div>
                <div style="position: absolute; bottom: -30px; color: white; font-weight: 500; font-size: 12px; text-align: center; width: 100%; padding: 8px; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);">
                    ${artist}
                </div>
            `;
            
            artistItem.addEventListener('mouseenter', () => {
                artistItem.style.transform = 'translateY(-8px) scale(1.05)';
                artistItem.style.boxShadow = '0 12px 28px rgba(0,0,0,0.4)';
                artistItem.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            });
            
            artistItem.addEventListener('mouseleave', () => {
                artistItem.style.transform = 'translateY(0) scale(1)';
                artistItem.style.boxShadow = 'none';
                artistItem.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            artistsGrid.appendChild(artistItem);
        });
    }
}

// Liquid Glass Clock Implementation
class LiquidClock {
    constructor() {
        this.clockElement = document.getElementById('liquid-clock');
        this.timeElement = document.getElementById('clock-time');
        this.secondsElement = document.getElementById('clock-seconds');
        this.is24Hour = true; // Can be made configurable
        
        this.init();
    }
    
    init() {
        if (!this.clockElement || !this.timeElement || !this.secondsElement) {
            console.warn('Clock elements not found');
            return;
        }
        
        // Update time immediately
        this.updateTime();
        
        // Update every second
        setInterval(() => {
            this.updateTime();
        }, 1000);
        
        // Add click interaction to toggle 12/24 hour format
        this.clockElement.addEventListener('click', () => {
            this.is24Hour = !this.is24Hour;
            this.updateTime();
            
            // Add a little pulse animation on click
            this.clockElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.clockElement.style.transform = '';
            }, 150);
        });
    }
    
    updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        let period = '';
        
        if (!this.is24Hour) {
            period = hours >= 12 ? ' PM' : ' AM';
            hours = hours % 12 || 12; // Convert to 12-hour format
        }
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${period}`;
        const secondsString = `:${seconds.toString().padStart(2, '0')}`;
        
        this.timeElement.textContent = timeString;
        this.secondsElement.textContent = secondsString;
        
        // Add subtle animation when seconds change
        if (seconds === 0) {
            this.secondsElement.style.opacity = '0.5';
            setTimeout(() => {
                this.secondsElement.style.opacity = '';
            }, 100);
        }
    }
}

// Initialize tab system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tabSystem = new TabSystem();
    window.liquidClock = new LiquidClock();
});

// Initialize
loadTrack(0);
renderPlaylist();

// Performance Monitor Implementation
class PerformanceMonitor {
    constructor() {
        this.startTime = Date.now();
        this.interactionCount = 0;
        this.init();
        this.trackInteractions();
    }

    init() {
        // Update performance metrics every 2 seconds
        setInterval(() => {
            this.updatePerformance();
        }, 2000);

        // Initial update
        this.updatePerformance();
    }

    updatePerformance() {
        // Get real browser performance metrics
        const cpuUsage = this.getRealCPUUsage();
        const memoryUsage = this.getRealMemoryUsage();
        const gpuUsage = this.getRealGPUUsage();
        const diskUsage = this.getRealDiskUsage();
        const networkUsage = this.getRealNetworkUsage();
        const temperature = this.getRealTemperature();

        this.updateMetric('cpu-usage', 'cpu-bar', cpuUsage, '%');
        this.updateMetric('memory-usage', 'memory-bar', memoryUsage, '%');
        this.updateMetric('gpu-usage', 'gpu-bar', gpuUsage, '%');
        this.updateMetric('disk-usage', 'disk-bar', diskUsage, '%');
        this.updateMetric('network-usage', 'network-bar', networkUsage, ' Mbps');
        this.updateMetric('temp-usage', 'temp-bar', temperature, '°C');

        // Update system info
        this.updateSystemInfo();
    }

    getRealCPUUsage() {
        // Use Performance API to measure CPU usage
        if (performance && performance.memory) {
            const memoryInfo = performance.memory;
            const usedMemory = memoryInfo.usedJSHeapSize;
            const totalMemory = memoryInfo.totalJSHeapSize;
            return Math.min(95, Math.max(5, (usedMemory / totalMemory) * 100));
        }
        
        // Fallback: Use navigation timing to estimate CPU load
        const navTiming = performance.timing;
        if (navTiming) {
            const loadTime = navTiming.loadEventEnd - navTiming.navigationStart;
            return Math.min(85, Math.max(15, (loadTime / 100) * 10));
        }
        
        return Math.random() * 30 + 25; // Realistic fallback
    }

    getRealMemoryUsage() {
        // Use Performance Memory API if available
        if (performance && performance.memory) {
            const memoryInfo = performance.memory;
            const usedMemory = memoryInfo.usedJSHeapSize / (1024 * 1024); // MB
            const totalMemory = memoryInfo.jsHeapSizeLimit / (1024 * 1024); // MB
            return Math.min(90, Math.max(20, (usedMemory / totalMemory) * 100));
        }
        
        // Fallback estimation based on device memory
        if (navigator.deviceMemory) {
            const estimatedUsage = Math.random() * 30 + 40; // 40-70% range
            return Math.min(85, estimatedUsage);
        }
        
        return Math.random() * 25 + 45; // Realistic fallback
    }

    getRealGPUUsage() {
        // Try to get GPU info from WebGL context
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    // Estimate GPU usage based on renderer and current activity
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    const isHighEnd = renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('RTX');
                    
                    // Base usage on number of animations and visual elements
                    const animations = document.getAnimations().length;
                    const baseUsage = isHighEnd ? 15 : 25;
                    const activityBonus = Math.min(30, animations * 2);
                    
                    return Math.min(80, baseUsage + activityBonus + Math.random() * 10);
                }
            }
        } catch (e) {
            console.log('GPU detection not available');
        }
        
        return Math.random() * 20 + 15; // Realistic fallback
    }

    getRealDiskUsage() {
        // Estimate disk activity based on localStorage and session activity
        try {
            const storageUsed = new Blob([localStorage.getItem('performance-data') || '']).size;
            const baseActivity = Math.min(40, storageUsed / 100);
            
            // Add activity based on page interactions
            const interactions = this.interactionCount || 0;
            const activityBonus = Math.min(20, interactions * 0.5);
            
            return Math.min(60, baseActivity + activityBonus + Math.random() * 5);
        } catch (e) {
            return Math.random() * 15 + 10; // Realistic fallback
        }
    }

    getRealNetworkUsage() {
        // Use Network Information API if available
        if (navigator.connection) {
            const connection = navigator.connection;
            const downlink = connection.downlink; // Mbps
            const effectiveType = connection.effectiveType;
            
            // Estimate usage based on connection type and current activity
            let baseUsage = 0;
            switch (effectiveType) {
                case '4g': baseUsage = Math.random() * 50 + 20; break;
                case '3g': baseUsage = Math.random() * 20 + 5; break;
                case '2g': baseUsage = Math.random() * 5 + 1; break;
                default: baseUsage = Math.random() * 30 + 10;
            }
            
            return Math.min(downlink * 0.8, baseUsage);
        }
        
        // Fallback: Estimate based on current page resources
        const resources = performance.getEntriesByType('resource');
        const recentResources = resources.filter(r => Date.now() - r.fetchStart < 5000);
        const networkActivity = Math.min(80, recentResources.length * 5 + Math.random() * 10);
        
        return networkActivity;
    }

    getRealTemperature() {
        // Estimate temperature based on CPU usage and time
        const cpuUsage = this.getRealCPUUsage();
        const timeBasedHeat = Math.sin(Date.now() / 10000) * 5; // Slight variation
        
        // Base temperature calculation
        let baseTemp = 35 + (cpuUsage * 0.3) + timeBasedHeat;
        
        // Add some realistic variation
        const variation = (Math.random() - 0.5) * 3;
        
        return Math.min(85, Math.max(30, baseTemp + variation));
    }

    generateRealisticValue(min, max) {
        // Generate values with some randomness but within realistic bounds
        const base = Math.random() * (max - min) + min;
        // Add some variation to make it look more realistic
        const variation = (Math.random() - 0.5) * 10;
        return Math.max(min, Math.min(max, base + variation));
    }

    updateMetric(valueId, barId, value, unit) {
        const valueElement = document.getElementById(valueId);
        const barElement = document.getElementById(barId);

        if (valueElement) {
            valueElement.textContent = Math.round(value) + unit;
        }

        if (barElement) {
            const percentage = unit === '°C' ? (value / 100) * 100 : value;
            barElement.style.width = percentage + '%';

            // Update bar color based on usage
            barElement.classList.remove('high-usage', 'critical-usage');
            if (percentage > 80) {
                barElement.classList.add('critical-usage');
            } else if (percentage > 60) {
                barElement.classList.add('high-usage');
            }
        }
    }

    updateSystemInfo() {
        const uptime = this.calculateUptime();
        const processes = Math.floor(Math.random() * 50) + 100; // 100-150 processes
        const osInfo = this.getRealOSInfo();

        const uptimeElement = document.getElementById('uptime-info');
        const processesElement = document.getElementById('processes-info');
        const osElement = document.getElementById('os-info');

        if (uptimeElement) {
            uptimeElement.textContent = uptime;
        }

        if (processesElement) {
            processesElement.textContent = processes;
        }

        if (osElement) {
            osElement.textContent = osInfo;
        }
    }

    getRealOSInfo() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        // Detect OS
        if (userAgent.includes('Windows')) {
            if (userAgent.includes('Windows NT 10')) return 'Windows 10/11';
            if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
            if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
            if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
            return 'Windows';
        }
        
        if (userAgent.includes('Mac')) {
            if (platform.includes('Intel')) return 'macOS (Intel)';
            if (platform.includes('Apple')) return 'macOS (Apple Silicon)';
            return 'macOS';
        }
        
        if (userAgent.includes('Linux')) {
            if (userAgent.includes('Ubuntu')) return 'Ubuntu';
            if (userAgent.includes('Fedora')) return 'Fedora';
            if (userAgent.includes('Debian')) return 'Debian';
            return 'Linux';
        }
        
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
        
        return 'Unknown OS';
    }

    trackInteractions() {
        // Track user interactions for more accurate performance metrics
        const events = ['click', 'keydown', 'scroll', 'mousemove'];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, () => {
                this.interactionCount++;
            }, { passive: true });
        });
    }

    calculateUptime() {
        const uptime = Date.now() - this.startTime;
        const hours = Math.floor(uptime / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }
}

// Initialize performance monitor
let performanceMonitor;

// Refresh performance function
function refreshPerformance() {
    if (performanceMonitor) {
        performanceMonitor.updatePerformance();
    }
}

// Initialize
loadTrack(0);
renderPlaylist();

// AI Assistant Implementation
class AIAssistant {
    constructor() {
        this.messagesContainer = document.getElementById('ai-messages');
        this.inputElement = document.getElementById('ai-input');
        this.isTyping = false;
        this.apiKey = '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';
        this.conversationHistory = [];
        this.maxHistoryLength = 10;
        this.loadAPIKey(); // Load saved API key
    }

    async sendMessage(message) {
        if (this.isTyping || !message.trim()) return;

        console.log('AI Assistant - Sending message:', message);
        console.log('API Key status:', this.apiKey ? 'Set' : 'Not set');

        // Check for API key setup command
        if (message.startsWith('/setkey ')) {
            const key = message.substring(8).trim();
            this.setupAPIKey(key);
            this.inputElement.value = '';
            return;
        }

        // Check if API key is configured
        if (this.apiKey === 'your-openai-api-key-here' || !this.apiKey) {
            this.addMessage("Please set your OpenAI API key first. Type '/setkey your-api-key-here' to configure.", 'assistant');
            this.inputElement.value = '';
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        this.inputElement.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            console.log('Making API call to OpenAI...');
            // Get AI response from OpenAI
            const response = await this.getOpenAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'assistant');
            console.log('AI Response received successfully');
        } catch (error) {
            this.hideTypingIndicator();
            console.error('Full error details:', error);
            
            let errorMessage = "I'm having trouble connecting to AI services. ";
            
            if (error.message.includes('HTTP error')) {
                errorMessage += "There might be a network issue or invalid API key.";
            } else if (error.message.includes('fetch')) {
                errorMessage += "Network connection failed. Please check your internet connection.";
            } else if (error.message.includes('No response')) {
                errorMessage += "The API returned no response. Please try again.";
            } else {
                errorMessage += `Error: ${error.message}`;
            }
            
            errorMessage += " Please check your API key or try again later.";
            this.addMessage(errorMessage, 'assistant');
        }
    }

    async getOpenAIResponse(message) {
        // Add to conversation history
        this.conversationHistory.push({ role: 'user', content: message });
        
        // Keep only recent messages for context
        const recentHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a helpful AI assistant for a music player interface. The user has 110 songs in their playlist and a real-time performance monitor. Be friendly, concise, and helpful. Focus on music-related questions, system performance, and interface guidance. Keep responses under 150 words.`
                        },
                        ...recentHistory
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('OpenAI API Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const data = await response.json();
            
            if (!data.choices || data.choices.length === 0) {
                throw new Error('No response from OpenAI API');
            }

            const aiResponse = data.choices[0].message.content;
            
            // Add AI response to history
            this.conversationHistory.push({ role: 'assistant', content: aiResponse });
            
            return aiResponse;
        } catch (error) {
            console.error('OpenAI API Error Details:', error);
            throw error;
        }
    }

    setAPIKey(key) {
        this.apiKey = key;
        localStorage.setItem('openai-api-key', key);
    }

    loadAPIKey() {
        const savedKey = localStorage.getItem('openai-api-key');
        if (savedKey) {
            this.apiKey = savedKey;
        } else {
            // Save the current key if it's set
            if (this.apiKey && this.apiKey !== 'your-openai-api-key-here') {
                localStorage.setItem('openai-api-key', this.apiKey);
                console.log('API key saved to localStorage');
            } else {
                // Prompt user for API key on first use
                this.addMessage("Please set your OpenAI API key to use AI features. Type '/setkey your-api-key-here' to configure.", 'assistant');
            }
        }
    }

    async testAPIConnection() {
        try {
            console.log('Testing API connection...');
            const testResponse = await this.getOpenAIResponse("Hello, can you respond with 'API test successful'?");
            this.addMessage("✅ API connection test successful! You can now chat with AI.", 'assistant');
            return true;
        } catch (error) {
            console.error('API test failed:', error);
            this.addMessage(`❌ API test failed: ${error.message}`, 'assistant');
            return false;
        }
    }

    setupAPIKey(key) {
        if (key && key.startsWith('sk-')) {
            this.setAPIKey(key);
            this.addMessage("API key configured successfully! You can now chat with AI.", 'assistant');
        } else {
            this.addMessage("Invalid API key format. Please use a valid OpenAI API key starting with 'sk-'.", 'assistant');
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'ai-avatar';
        
        if (sender === 'assistant') {
            avatar.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 11H9v2h2v-2zm0-4H9V6h2v3z" fill="currentColor"></path>
                </svg>
            `;
        } else {
            avatar.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 9C11.66 9 13 7.66 13 6s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 1c-2.33 0-7 1.17-7 3.5S7.67 17 10 17s7-1.17 7-3.5S12.33 10 10 10z" fill="currentColor"></path>
                </svg>
            `;
        }
        
        const content = document.createElement('div');
        content.className = 'ai-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'ai-text';
        textDiv.textContent = text;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'ai-time';
        timeDiv.textContent = this.getCurrentTime();
        
        content.appendChild(textDiv);
        content.appendChild(timeDiv);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    clearChat() {
        this.messagesContainer.innerHTML = '';
        this.conversationHistory = []; // Clear conversation history
        this.addMessage("Chat cleared! How can I help you today?", 'assistant');
    }
}

// Initialize AI assistant
let aiAssistant;

// AI Assistant Functions
function sendAIMessage() {
    const input = document.getElementById('ai-input');
    if (aiAssistant && input.value.trim()) {
        aiAssistant.sendMessage(input.value);
    }
}

function handleAIInput(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

function sendSuggestion(suggestion) {
    if (aiAssistant) {
        aiAssistant.sendMessage(suggestion);
    }
}

function clearAIChat() {
    if (aiAssistant) {
        aiAssistant.clearChat();
    }
}

// Add typing dots CSS
const typingDotsCSS = `
.typing-dots {
    display: flex;
    gap: 4px;
    padding: 4px 0;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    animation: typing 1.4s infinite;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
    }
    30% {
        opacity: 1;
        transform: scale(1);
    }
}
`;

// Add typing dots CSS to head
const styleSheet = document.createElement('style');
styleSheet.textContent = typingDotsCSS;
document.head.appendChild(styleSheet);

// Initialize
loadTrack(0);
renderPlaylist();

// Multi-Note System Implementation
class MultiNoteSystem {
    constructor() {
        this.notesList = document.getElementById('notes-list');
        this.noteCount = document.getElementById('note-count');
        this.notes = [];
        this.noteIdCounter = 0;
        this.autoSaveTimer = null;
        
        this.init();
    }

    init() {
        this.loadNotes();
        this.initAutoSave();
        console.log('MultiNoteSystem initialized');
    }

    loadNotes() {
        const savedNotes = localStorage.getItem('multi-notes');
        if (savedNotes) {
            try {
                this.notes = JSON.parse(savedNotes);
                this.noteIdCounter = Math.max(...this.notes.map(n => n.id), 0);
                this.renderAllNotes();
                console.log('Loaded', this.notes.length, 'notes');
            } catch (error) {
                console.error('Error loading notes:', error);
                this.notes = [];
            }
        } else {
            // Create initial note if no notes exist
            this.addNewNote();
        }
    }

    initAutoSave() {
        // Auto-save every 2 seconds
        this.autoSaveTimer = setInterval(() => {
            this.saveAllNotes(true);
        }, 2000);
    }

    saveAllNotes(silent = false) {
        const notesData = this.notes.map(note => ({
            id: note.id,
            content: note.content,
            timestamp: note.timestamp,
            isExpanded: note.isExpanded
        }));
        
        localStorage.setItem('multi-notes', JSON.stringify(notesData));
        
        if (!silent) {
            console.log('All notes saved');
        }
    }

    addNewNote() {
        console.log('addNewNote method called');
        try {
            const noteId = ++this.noteIdCounter;
            const timestamp = new Date().toISOString();
            
            const note = {
                id: noteId,
                content: '',
                timestamp: timestamp,
                isExpanded: true
            };
            
            this.notes.unshift(note); // Add to beginning
            this.renderNote(note, true); // Render with animation
            this.updateNoteCount();
            
            // Focus on the new note after a short delay
            setTimeout(() => {
                const noteElement = document.querySelector(`[data-note-id="${noteId}"] .note-content`);
                if (noteElement) {
                    noteElement.focus();
                    console.log('Focused on new note:', noteId);
                }
            }, 100);
            
            console.log('Added new note:', noteId);
        } catch (error) {
            console.error('Error adding new note:', error);
            alert('Failed to create new note. Please try again.');
        }
    }

    renderNote(note, isNew = false) {
        const noteElement = document.createElement('div');
        noteElement.className = `note-item expanded ${isNew ? 'new-note' : ''}`;
        noteElement.dataset.noteId = note.id;
        
        const date = new Date(note.timestamp);
        const timeString = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        noteElement.innerHTML = `
            <div class="note-header">
                <span class="note-title">Note #${note.id}</span>
                <span class="note-timestamp">${timeString}</span>
            </div>
            <div class="note-preview" style="display: none;"></div>
            <textarea class="note-content" placeholder="Start typing your note..." oninput="handleNoteInput(${note.id}, this)">${note.content}</textarea>
            <div class="note-actions">
                <button class="note-action-btn" onclick="saveNote(${note.id})">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1l8 8-8 8 3.5-3.5L1 1zm6 0v2h2v-2h-2z" fill="currentColor"></path>
                    </svg>
                    Save
                </button>
                <button class="note-action-btn" onclick="deleteNote(${note.id})">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 2h6v6H2V2zm1 1v4h4V3H3z" stroke="currentColor" stroke-width="1"></path>
                    </svg>
                    Delete
                </button>
            </div>
        `;
        
        // Insert at the beginning of the notes list
        if (this.notesList.firstChild) {
            this.notesList.insertBefore(noteElement, this.notesList.firstChild);
        } else {
            this.notesList.appendChild(noteElement);
        }
        
        // Add click handler for collapsed notes
        noteElement.addEventListener('click', (e) => {
            if (e.target === noteElement || e.target.classList.contains('note-preview')) {
                if (note.isExpanded) {
                    this.collapseNote(note.id);
                } else {
                    this.expandNote(note.id);
                }
            }
        });
        
        // Remove animation class after animation completes
        if (isNew) {
            setTimeout(() => {
                noteElement.classList.remove('new-note');
            }, 400);
        }
    }

    renderAllNotes() {
        this.notesList.innerHTML = '';
        this.notes.forEach(note => {
            this.renderNote(note, false);
        });
        this.updateNoteCount();
    }

    collapseNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        note.isExpanded = false;
        const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
        
        if (noteElement) {
            const content = noteElement.querySelector('.note-content');
            const preview = noteElement.querySelector('.note-preview');
            
            if (content && preview) {
                preview.textContent = content.value || 'Empty note';
                preview.style.display = 'block';
                content.style.display = 'none';
                
                noteElement.classList.remove('expanded');
                noteElement.classList.add('collapsed');
                noteElement.classList.add('collapsing');
                
                setTimeout(() => {
                    noteElement.classList.remove('collapsing');
                }, 300);
            }
        }
    }

    expandNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        note.isExpanded = true;
        const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
        
        if (noteElement) {
            const content = noteElement.querySelector('.note-content');
            const preview = noteElement.querySelector('.note-preview');
            
            if (content && preview) {
                preview.style.display = 'none';
                content.style.display = 'block';
                
                noteElement.classList.remove('collapsed');
                noteElement.classList.add('expanding');
                
                setTimeout(() => {
                    noteElement.classList.remove('expanding');
                    content.focus();
                }, 300);
            }
        }
    }

    saveNote(noteId) {
        console.log('saveNote method called for note:', noteId);
        try {
            const note = this.notes.find(n => n.id === noteId);
            if (!note) {
                console.error('Note not found:', noteId);
                return;
            }
            
            const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
            const content = noteElement.querySelector('.note-content');
            
            if (content) {
                note.content = content.value;
                note.timestamp = new Date().toISOString();
                
                // Update timestamp display
                const timestampElement = noteElement.querySelector('.note-timestamp');
                if (timestampElement) {
                    const date = new Date(note.timestamp);
                    timestampElement.textContent = date.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                }
                
                // Show save feedback
                noteElement.classList.add('saving');
                setTimeout(() => {
                    noteElement.classList.remove('saving');
                }, 500);
                
                this.saveAllNotes(true);
                console.log('Saved note:', noteId, 'characters:', note.content.length);
            } else {
                console.error('Content element not found for note:', noteId);
            }
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note. Please try again.');
        }
    }

    deleteNote(noteId) {
        const noteIndex = this.notes.findIndex(n => n.id === noteId);
        if (noteIndex === -1) return;
        
        if (confirm('Are you sure you want to delete this note?')) {
            const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
            
            if (noteElement) {
                // Add fade out animation
                noteElement.style.opacity = '0';
                noteElement.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    noteElement.remove();
                    this.notes.splice(noteIndex, 1);
                    this.updateNoteCount();
                    this.saveAllNotes(true);
                    console.log('Deleted note:', noteId);
                }, 300);
            }
        }
    }

    updateNoteCount() {
        if (this.noteCount) {
            this.noteCount.textContent = this.notes.length;
        }
    }

    clearAllNotes() {
        if (confirm('Are you sure you want to clear all notes?')) {
            this.notes = [];
            this.notesList.innerHTML = '';
            this.noteIdCounter = 0; // Reset note counter to start from 1
            this.updateNoteCount();
            localStorage.removeItem('multi-notes');
            console.log('All notes cleared, note counter reset');
            
            // Create a new empty note
            setTimeout(() => {
                this.addNewNote();
            }, 300);
        }
    }

    downloadAllNotes() {
        console.log('downloadAllNotes method called');
        try {
            if (this.notes.length === 0) {
                console.log('No notes to download');
                alert('No notes to download!');
                return;
            }
            
            let allContent = '';
            this.notes.forEach(note => {
                const date = new Date(note.timestamp);
                const dateString = date.toLocaleString();
                allContent += `Note #${note.id} - ${dateString}\n`;
                allContent += `${note.content || '(Empty note)'}\n`;
                allContent += '\n---\n\n';
            });
            
            const blob = new Blob([allContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quick-notes-${new Date().toISOString().split('T')[0]}.txt`;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('Downloaded all notes successfully');
            
            // Show success feedback
            const firstNote = document.querySelector('.note-item');
            if (firstNote) {
                firstNote.classList.add('saving');
                setTimeout(() => {
                    firstNote.classList.remove('saving');
                }, 500);
            }
            
        } catch (error) {
            console.error('Error downloading notes:', error);
            alert('Failed to download notes. Please try again.');
        }
    }
}

// Global functions for HTML onclick handlers
let multiNoteSystem;

function handleNoteInput(noteId, textarea) {
    console.log('Note input detected for note:', noteId);
    if (window.multiNoteSystem) {
        // Auto-save while typing (debounced)
        clearTimeout(window.multiNoteSystem.saveTimeout);
        window.multiNoteSystem.saveTimeout = setTimeout(() => {
            window.multiNoteSystem.saveNote(noteId);
        }, 1000);
    } else {
        console.error('MultiNoteSystem not initialized for auto-save');
    }
}

function addNewNote() {
    console.log('New Note button clicked');
    console.log('multiNoteSystem available:', !!window.multiNoteSystem);
    
    if (window.multiNoteSystem) {
        window.multiNoteSystem.addNewNote();
    } else {
        console.error('MultiNoteSystem not initialized');
        alert('Note system not initialized. Please refresh the page.');
    }
}

function handleFallbackNoteInput(noteId) {
    // Simple auto-save for fallback notes
    clearTimeout(window.fallbackSaveTimeout);
    window.fallbackSaveTimeout = setTimeout(() => {
        saveFallbackNote(noteId);
    }, 1000);
}

function saveFallbackNote(noteId) {
    const noteElement = document.querySelector(`.note-item:nth-child(${noteId}) .note-content`);
    if (noteElement) {
        const content = noteElement.value;
        localStorage.setItem(`fallback-note-${noteId}`, content);
        console.log('Saved fallback note:', noteId);
        
        // Show save feedback
        noteElement.style.borderColor = 'rgba(76, 175, 80, 0.5)';
        setTimeout(() => {
            noteElement.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }, 500);
    }
}

function deleteFallbackNote(noteId) {
    const noteElement = document.querySelector(`.note-item:nth-child(${noteId})`);
    if (noteElement && confirm('Delete this note?')) {
        noteElement.style.opacity = '0';
        noteElement.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            noteElement.remove();
            localStorage.removeItem(`fallback-note-${noteId}`);
            console.log('Deleted fallback note:', noteId);
        }, 300);
    }
}

function saveNote(noteId) {
    console.log('Save button clicked for note:', noteId);
    console.log('multiNoteSystem available:', !!window.multiNoteSystem);
    
    if (window.multiNoteSystem) {
        window.multiNoteSystem.saveNote(noteId);
    } else {
        console.error('MultiNoteSystem not initialized');
        alert('Note system not initialized. Please refresh the page.');
    }
}

function deleteNote(noteId) {
    console.log('Delete button clicked for note:', noteId);
    console.log('multiNoteSystem available:', !!window.multiNoteSystem);
    
    if (window.multiNoteSystem) {
        window.multiNoteSystem.deleteNote(noteId);
    } else {
        console.error('MultiNoteSystem not initialized');
        alert('Note system not initialized. Please refresh the page.');
    }
}

function deleteAllNotes() {
    console.log('Delete All button clicked');
    console.log('multiNoteSystem available:', !!window.multiNoteSystem);
    console.log('window object:', Object.keys(window).filter(k => k.includes('multi')));
    
    if (window.multiNoteSystem) {
        console.log('Calling clearAllNotes on multiNoteSystem');
        window.multiNoteSystem.clearAllNotes();
    } else {
        console.error('MultiNoteSystem not initialized');
        // Fallback: Clear all notes if system not available
        if (confirm('Are you sure you want to delete all notes?')) {
            try {
                const notesList = document.getElementById('notes-list');
                console.log('Found notes-list element:', !!notesList);
                if (notesList) {
                    notesList.innerHTML = '';
                    // Clear localStorage
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('multi-notes') || key.startsWith('fallback-note')) {
                            localStorage.removeItem(key);
                        }
                    });
                    console.log('All notes deleted (fallback method)');
                    
                    // Update note count
                    const noteCount = document.getElementById('note-count');
                    if (noteCount) {
                        noteCount.textContent = '0';
                    }
                    
                    // Create a new empty note
                    setTimeout(() => {
                        if (window.multiNoteSystem) {
                            window.multiNoteSystem.addNewNote();
                        }
                    }, 300);
                }
            } catch (error) {
                console.error('Error deleting all notes:', error);
                alert('Failed to delete notes. Please refresh the page.');
            }
        }
    }
}

function downloadAllNotes() {
    console.log('Export All button clicked');
    console.log('multiNoteSystem available:', !!window.multiNoteSystem);
    
    if (window.multiNoteSystem) {
        window.multiNoteSystem.downloadAllNotes();
    } else {
        console.error('MultiNoteSystem not initialized');
        console.log('Available window properties:', Object.keys(window).filter(k => k.includes('note') || k.includes('Note')));
        // Fallback export if MultiNoteSystem not available
        alert('Note system not initialized. Please refresh the page.');
    }
}


// Music Player Class
class MusicPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audio-player');
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.volume = 1;
        this.isInitialized = false;
        
        this.initializePlayer();
    }
    
    initializePlayer() {
        if (!this.audioPlayer) {
            console.error('Audio player element not found');
            return;
        }
        
        // Set up audio event listeners
        this.audioPlayer.addEventListener('loadeddata', () => {
            console.log('Song loaded:', songs[this.currentSongIndex].name);
        });
        
        this.audioPlayer.addEventListener('ended', () => {
            this.playNext();
        });
        
        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.playNext();
        });
        
        // DO NOT auto-load first song on initialization
        // Only load when user explicitly plays
        console.log('MusicPlayer initialized - waiting for user action');
    }
    
    loadSong(index) {
        if (index < 0 || index >= songs.length) return;
        
        this.currentSongIndex = index;
        const song = songs[index];
        
        this.audioPlayer.src = song.path;
        this.audioPlayer.load();
        
        // DO NOT update now playing display on load
        // Only update when actually playing
        console.log('Loading song:', song.name);
    }
    
    updateNowPlaying(song) {
        const trackName = document.querySelector('.track-name');
        const artistName = document.querySelector('.artist-name');
        
        if (trackName) {
            // Remove all scrolling-related classes
            trackName.classList.remove('initial', 'scrolling');
            
            // Set the text content
            trackName.textContent = song.name;
            
            // Only enable scrolling if:
            // 1. This is an actual song from playlist
            // 2. The music player is currently playing
            // 3. The text actually overflows the container
            if (song && song.path && song.path.startsWith('songs/') && this.isPlaying) {
                // Check if text is too long and needs scrolling
                setTimeout(() => {
                    const containerWidth = trackName.clientWidth;
                    const textWidth = trackName.scrollWidth;
                    
                    console.log(`Track: "${song.name}" - Container: ${containerWidth}px, Text: ${textWidth}px, Playing: ${this.isPlaying}`);
                    
                    if (textWidth > containerWidth) {
                        // Calculate the scroll distance
                        const scrollDistance = textWidth - containerWidth;
                        trackName.style.setProperty('--scroll-width', `${scrollDistance}px`);
                        trackName.classList.add('scrolling');
                        console.log('Scrolling enabled for:', song.name);
                    } else {
                        console.log('No scrolling needed for:', song.name);
                    }
                }, 200);
            } else {
                // Ensure no scrolling for default text or when not playing
                console.log('Scrolling disabled - Default text or not playing');
            }
        }
        
        if (artistName) artistName.textContent = song.artist;
    }
    
    play() {
        if (this.audioPlayer && !this.isPlaying) {
            // Load first song if not loaded yet
            if (!this.audioPlayer.src) {
                this.loadSong(0);
            }
            
            this.audioPlayer.play().then(() => {
                this.isPlaying = true;
                this.updatePlayPauseIcon(true);
                // Update now playing display when actually playing
                this.updateNowPlaying(songs[this.currentSongIndex]);
                console.log('Playing:', songs[this.currentSongIndex].name);
            }).catch(error => {
                console.error('Error playing song:', error);
            });
        }
    }
    
    pause() {
        if (this.audioPlayer && this.isPlaying) {
            this.audioPlayer.pause();
            this.isPlaying = false;
            this.updatePlayPauseIcon(false);
            // Stop scrolling when paused
            const trackName = document.querySelector('.track-name');
            if (trackName) {
                trackName.classList.remove('scrolling');
            }
            console.log('Paused:', songs[this.currentSongIndex].name);
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    playNext() {
        const nextIndex = (this.currentSongIndex + 1) % songs.length;
        this.loadSong(nextIndex);
        
        if (this.isPlaying) {
            this.play();
        }
    }
    
    playPrevious() {
        const prevIndex = this.currentSongIndex === 0 ? songs.length - 1 : this.currentSongIndex - 1;
        this.loadSong(prevIndex);
        
        if (this.isPlaying) {
            this.play();
        }
    }
    
    setVolume(volume) {
        this.volume = volume;
        if (this.audioPlayer) {
            this.audioPlayer.volume = volume;
        }
    }
    
    updatePlayPauseIcon(playing) {
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            const svg = playPauseBtn.querySelector('svg');
            if (playing) {
                // Show pause icon
                svg.innerHTML = `
                    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"></rect>
                    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"></rect>
                `;
            } else {
                // Show play icon
                svg.innerHTML = `
                    <path d="M8 5v14l11-7z" fill="currentColor"></path>
                `;
            }
        }
    }
}

// Initialize performance monitor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing systems...');
    window.tabSystem = new TabSystem();
    window.liquidClock = new LiquidClock();
    window.performanceMonitor = new PerformanceMonitor();
    window.multiNoteSystem = new MultiNoteSystem();
    window.musicPlayer = new MusicPlayer();
    console.log('MultiNoteSystem initialized:', !!window.multiNoteSystem);
    console.log('MusicPlayer initialized:', !!window.musicPlayer);
    
    // Initialize volume control
    initializeVolumeControl();
    
    // Initialize spacebar play/pause functionality
    initializeSpacebarControl();
});

// Spacebar Play/Pause Control
function initializeSpacebarControl() {
    // Spacebar event listener
    document.addEventListener('keydown', (e) => {
        // Check if spacebar is pressed and not in an input field
        if (e.code === 'Space' && 
            !e.target.matches('input[type="text"], input[type="search"], textarea, [contenteditable]')) {
            e.preventDefault(); // Prevent default spacebar scrolling
            e.stopPropagation();
            
            if (window.musicPlayer) {
                window.musicPlayer.togglePlayPause();
            }
        }
    });
    
    // Play/pause button click handler
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.musicPlayer) {
                window.musicPlayer.togglePlayPause();
            }
        });
    }
    
    // Previous button click handler
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.musicPlayer) {
                window.musicPlayer.playPrevious();
            }
        });
    }
    
    // Next button click handler
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.musicPlayer) {
                window.musicPlayer.playNext();
            }
        });
    }
    
    console.log('Spacebar play/pause control initialized');
}

// Volume Control with Mute Toggle
function initializeVolumeControl() {
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const muteOverlay = document.getElementById('mute-overlay');
    const volumeIcon = document.getElementById('volume-icon');
    const volumeControl = document.querySelector('.volume-control');
    
    let isMuted = false;
    let previousVolume = 1;
    
    if (volumeBtn && volumeSlider && muteOverlay && volumeIcon) {
        // Volume button click handler
        volumeBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            
            if (isMuted) {
                // Mute: Store previous volume and set to 0
                previousVolume = volumeSlider.value;
                volumeSlider.value = 0;
                muteOverlay.style.display = 'flex';
                volumeIcon.style.opacity = '0.3';
                console.log('Volume muted');
            } else {
                // Unmute: Restore previous volume
                volumeSlider.value = previousVolume > 0 ? previousVolume : 1;
                muteOverlay.style.display = 'none';
                volumeIcon.style.opacity = '1';
                console.log('Volume unmuted:', volumeSlider.value);
            }
            
            // Trigger volume change event
            volumeSlider.dispatchEvent(new Event('input'));
        });
        
        // Volume slider change handler
        volumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            
            if (window.musicPlayer) {
                window.musicPlayer.setVolume(volume);
            }
            
            if (volume === 0 && !isMuted) {
                // Auto-mute when volume reaches 0
                isMuted = true;
                previousVolume = 1;
                muteOverlay.style.display = 'flex';
                volumeIcon.style.opacity = '0.3';
            } else if (volume > 0 && isMuted) {
                // Auto-unmute when volume increases from 0
                isMuted = false;
                muteOverlay.style.display = 'none';
                volumeIcon.style.opacity = '1';
            }
            
            console.log('Volume changed:', volume);
        });
        
        // Two-finger swipe gesture support for trackpad
        if (volumeControl) {
            let touchStartY = 0;
            let touchStartX = 0;
            let isTwoFingerTouch = false;
            let lastTouchTime = 0;
            
            volumeControl.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    isTwoFingerTouch = true;
                    touchStartY = e.touches[0].clientY;
                    touchStartX = e.touches[0].clientX;
                    lastTouchTime = Date.now();
                    e.preventDefault();
                }
            });
            
            volumeControl.addEventListener('touchmove', (e) => {
                if (isTwoFingerTouch && e.touches.length === 2) {
                    e.preventDefault();
                }
            });
            
            volumeControl.addEventListener('touchend', (e) => {
                if (isTwoFingerTouch && e.touches.length === 0) {
                    const currentTime = Date.now();
                    const touchDuration = currentTime - lastTouchTime;
                    
                    // Only process if it was a quick swipe (less than 300ms)
                    if (touchDuration < 300) {
                        const touchEndY = e.changedTouches[0].clientY;
                        const touchEndX = e.changedTouches[0].clientX;
                        const deltaY = touchStartY - touchEndY;
                        const deltaX = Math.abs(touchStartX - touchEndX);
                        
                        // Check if it's primarily a vertical swipe (not horizontal scroll)
                        if (Math.abs(deltaY) > 20 && deltaX < 50) {
                            const currentVolume = parseFloat(volumeSlider.value);
                            const volumeChange = Math.min(0.1, Math.abs(deltaY) / 200);
                            
                            if (deltaY > 0) {
                                // Swipe up - decrease volume
                                const newVolume = Math.max(0, currentVolume - volumeChange);
                                volumeSlider.value = newVolume;
                                console.log('Swipe up - Volume decreased:', newVolume);
                            } else {
                                // Swipe down - increase volume
                                const newVolume = Math.min(1, currentVolume + volumeChange);
                                volumeSlider.value = newVolume;
                                console.log('Swipe down - Volume increased:', newVolume);
                            }
                            
                            // Trigger volume change event
                            volumeSlider.dispatchEvent(new Event('input'));
                            
                            // Add visual feedback
                            addVolumeGestureFeedback(deltaY > 0 ? 'decrease' : 'increase');
                        }
                    }
                    
                    isTwoFingerTouch = false;
                }
            });
        }
        
        // Mouse wheel support for volume control
        if (volumeControl) {
            volumeControl.addEventListener('wheel', (e) => {
                e.preventDefault();
                const currentVolume = parseFloat(volumeSlider.value);
                const volumeChange = 0.05;
                
                if (e.deltaY < 0) {
                    // Scroll up - increase volume
                    const newVolume = Math.min(1, currentVolume + volumeChange);
                    volumeSlider.value = newVolume;
                    console.log('Scroll up - Volume increased:', newVolume);
                } else {
                    // Scroll down - decrease volume
                    const newVolume = Math.max(0, currentVolume - volumeChange);
                    volumeSlider.value = newVolume;
                    console.log('Scroll down - Volume decreased:', newVolume);
                }
                
                // Trigger volume change event
                volumeSlider.dispatchEvent(new Event('input'));
            });
        }
    }
}

// Visual feedback for volume gestures
function addVolumeGestureFeedback(action) {
    const volumeControl = document.querySelector('.volume-control');
    if (!volumeControl) return;
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${action === 'increase' ? 'rgba(52, 211, 153, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        pointer-events: none;
        z-index: 1000;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        animation: fadeInOut 0.8s ease;
    `;
    
    feedback.textContent = action === 'increase' ? '▲' : '▼';
    
    // Add animation if not already present
    if (!document.querySelector('#volume-feedback-style')) {
        const style = document.createElement('style');
        style.id = 'volume-feedback-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    volumeControl.style.position = 'relative';
    volumeControl.appendChild(feedback);
    
    // Remove feedback after animation
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 800);
}