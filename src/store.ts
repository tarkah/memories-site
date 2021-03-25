import { writable } from "svelte/store";

export const token = writable(localStorage.getItem("token") || "");
token.subscribe((value) => {
    localStorage.setItem("token", value);
});

export const isTokenValid = writable(false);

export const y = writable(parseFloat(sessionStorage.getItem("y")) || 0);
y.subscribe((value) => {
    sessionStorage.setItem("y", `${value}`);
});