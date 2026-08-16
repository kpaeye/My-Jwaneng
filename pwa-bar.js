function isPWA(){
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

function createPWABar(){

    const bar = document.createElement("div");
    bar.className = "pwa-bar";
    bar.innerHTML = `
        <a href="index.html"><span>🏠</span>Home</a>
        <a href="exploremyjwaneng.html"><span>🔍</span>Explore</a>
        <a href="jobs.html"><span>💼</span>Jobs</a>
        <a href="marketplace.html"><span>🛒</span>Market</a>
        <a href="townnews.html"><span>📰</span>News</a>
    `;

    document.body.appendChild(bar);

    if(isPWA()){
        bar.style.display = "flex";
    }
}

document.addEventListener("DOMContentLoaded", createPWABar);