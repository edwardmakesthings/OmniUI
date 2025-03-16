import axios from 'axios';
import { useComponentStore } from '@/store/componentStore';

// API base configuration
const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export async function saveComponentsToDatabase() {
    const store = useComponentStore.getState();
    const components = Object.values(store.definitions);

    try {
        const response = await api.post('/components', components);
        return response.data;
    } catch (err) {
        console.error('Failed to save components:', err);
        throw err;
    }
}

export async function loadComponentsFromDatabase() {
    const store = useComponentStore.getState();

    try {
        const response = await api.get('/components');
        const components = response.data;

        // Register each component
        components.forEach(component => {
            store.addDefinition(component);
        });

        return components;
    } catch (err) {
        console.error('Failed to load components:', err);
        // Fallback to local defaults if DB load fails
        initializeDefaultComponents();
        throw err;
    }
}

// Safety function to ensure we have components
function initializeDefaultComponents() {
    const store = useComponentStore.getState();

    // Check if store is empty
    if (Object.keys(store.definitions).length === 0) {
        console.warn('No components loaded from database, initializing defaults');

        // Import and register defaults
        import('@/registry/defaultComponents').then(module => {
            module.registerDefaultComponents();
        }).catch(err => {
            console.error('Failed to load default components', err);
        });
    }
}