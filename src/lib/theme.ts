// Runs before the first paint so a saved dark preference never flashes white.
export const themeInitScript = `(function(){var t;try{t=localStorage.getItem('seg-theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t})()`;
