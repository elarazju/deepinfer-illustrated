import { mount } from 'svelte';
import App from './App.svelte';
import './lib/tokens.css';
import './style.css';
mount(App, { target: document.getElementById('app')! });
