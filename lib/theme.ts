export type Scheme = "system" | "light" | "dark";

export const SCHEME_KEY = "komorebi-site-scheme";
const DARK_MEDIA = "(prefers-color-scheme: dark)";

/**
 * Runs in <head> before the first paint: applies a stored light or dark choice with Pico
 * Reforged's data-theme attribute, so the page never flashes the other scheme. Without a stored
 * choice (or without JavaScript) the page follows prefers-color-scheme.
 */
export const SCHEME_INIT_SCRIPT = `(function(){var r=document.documentElement;r.classList.add("js");try{var s=localStorage.getItem(${JSON.stringify(SCHEME_KEY)});if(s==="light"||s==="dark")r.setAttribute("data-theme",s)}catch(e){}})()`;

/**
 * Screenshots pick their light or dark file with <source media="(prefers-color-scheme: dark)">.
 * A forced scheme rewrites that media query, so the pictures follow the button too. Runs at the
 * end of <body> (before lazy images load) and whenever the scheme changes.
 */
export const PICTURE_SCHEME_SCRIPT = `(function(){var t=document.documentElement.getAttribute("data-theme");if(!t)return;document.querySelectorAll("source[data-scheme=dark]").forEach(function(s){s.media=t==="dark"?"all":"not all"})})()`;

export function applyPictureScheme(scheme: Scheme) {
  document.querySelectorAll<HTMLSourceElement>("source[data-scheme=dark]").forEach((source) => {
    source.media = scheme === "system" ? DARK_MEDIA : scheme === "dark" ? "all" : "not all";
  });
}
