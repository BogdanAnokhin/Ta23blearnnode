<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const cookies = ref(0);
const buildings = ref([
    { name: 'Cursor', price: 15, cps: 0.1, count: 0},
    { name: 'Grandma', price: 100, cps: 1, count: 0},
    { name: 'Farm', price: 1_000, cps: 10, count: 0},
    { name: 'Factory', price: 10_000, cps: 30, count: 0},
]);

function buyBuilding(building) {
    if (cookies.value >= building.price) {
        cookies.value -= building.price;
        building.price += Math.ceil(building.price * 0.15);
        building.count++;
    }
}

const cps = computed(() =>
    buildings.value.reduce((sum, b) => sum + b.cps * b.count, 0)
);

let saveInterval;

const saveGameState = () => {
    const gameState = {
        cookies: cookies.value,
        buildings: buildings.value
    };
    try {
        localStorage.setItem('cookieGameSave', JSON.stringify(gameState));
    } catch (e) {
        console.error("Save error", e);
    }
};

const loadGameState = () => {
    try {
        const data = localStorage.getItem('cookieGameSave');
        if (data) {
            const parsed = JSON.parse(data);
            cookies.value = parsed.cookies || 0;
            buildings.value = buildings.value.map(b => {
                const saved = parsed.buildings.find(sb => sb.name === b.name);
                return saved ? {...b, ...saved} : b;
            });
        }
    } catch (e) {
        console.error("Load error", e);
    }
};

onMounted(() => {
    loadGameState();
    saveInterval = setInterval(saveGameState, 1000);
});
onBeforeUnmount(() => {
    clearInterval(saveInterval);
});

setInterval(() => {
    cookies.value += cps.value / 10;
    document.title = `🍪 ${cookies.value.toFixed(1)} Cookies!`;
}, 100);
</script>

<template>
    <div class="columns">
        <!-- Stats + Cookie -->
        <div class="column is-4 has-background-primary has-text-centered">
            <h1 class="is-size-1">{{ cookies.toFixed(1) }} cookies</h1>
            <h3 class="is-size-3">{{ cps.toFixed(1) }} cps</h3>
            <figure class="image is-square" @click="cookies++">
                <img src="https://sweetlorens.com/cdn/shop/products/Copy-of-Chocolate-Chunk-Full-Cookie-transparent-background.png?v=1687811511" />
            </figure>
        </div>

        <!-- Buildings Visuals -->
        <div class="column is-6 has-background-link">
            <!-- Grandma -->
            <div class="columns is-flex is-flex-wrap-wrap">
                <figure 
                    v-for="n in Math.floor(buildings.find(b => b.name === 'Grandma').count / 10) + 1"
                    v-if="buildings.find(b => b.name === 'Grandma').count >= 1"
                    class="image is-96x96 m-2"
                    :key="'grandma-' + n">
                    <img src="https://png.pngtree.com/png-clipart/20230914/original/pngtree-cute-grandma-clipart-the-cartoon-old-lady-character-has-a-bouquet-png-image_11242831.png">
                </figure>
            </div>
            <!-- Farm -->
            <div class="columns is-flex is-flex-wrap-wrap">
                <figure 
                    v-for="n in Math.floor(buildings.find(b => b.name === 'Farm').count / 10) + 1"
                    v-if="buildings.find(b => b.name === 'Farm').count >= 1"
                    class="image is-96x96 m-2"
                    :key="'farm-' + n">
                    <img src="https://pics.clipartpng.com/Corn_PNG_Clipart-466.png">
                </figure>
            </div>
            <!-- Factory -->
            <div class="columns is-flex is-flex-wrap-wrap">
                <figure 
                    v-for="n in Math.floor(buildings.find(b => b.name === 'Factory').count / 10) + 1"
                    v-if="buildings.find(b => b.name === 'Factory').count >= 1"
                    class="image is-96x96 m-2"
                    :key="'factory-' + n">
                    <img src="https://www.freeiconspng.com/uploads/gear-icon-11.png">
                </figure>
            </div>
        </div>

        <!-- Buttons -->
        <div class="column is-2 has-background-warning">
            <button 
                v-for="building in buildings" 
                :disabled="cookies < building.price" 
                @click="buyBuilding(building)" 
                class="button is-primary is-large is-fullwidth mb-3">
                {{ building.name }} 🍪{{ building.price }} #{{ building.count }}
            </button>
        </div>
    </div>
</template>
