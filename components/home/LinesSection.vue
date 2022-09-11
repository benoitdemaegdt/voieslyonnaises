<template>
  <div class="bg-white">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-24">
      <div class="space-y-8 sm:space-y-12">
        <div class="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl text-center">
          <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Avancement par ligne</h2>
          <p class="text-xl text-gray-500">Choisissez l'une des 13 Voies Lyonnaises pour voir son niveau d'avancement.</p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:sm:grid-cols-3">
          <div v-for="voie in voies" :key="voie.line" class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
            <div class="flex-shrink-0">
              <div
                class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                :class="`${voie.color}`"
              >
              {{ voie.line }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <NuxtLink :to="'/avancement/' + voie.path" class="focus:outline-none">
                <span class="absolute inset-0" aria-hidden="true" />
                <p class="text-sm font-medium text-gray-900">
                  Ligne {{ voie.line }}
                </p>
                <p class="text-sm text-gray-500 truncate">
                  {{ voie.from }} → {{ voie.to }}
                </p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const voies = [
  { line: '1', path: 'ligne-1', color: 'bg-ligne1', from: 'Vaulx-en-Velin', to: 'Saint-Fons' },
  { line: '2', path: 'ligne-2', color: 'bg-ligne2', from: 'Cailloux', to: 'Mions' },
  { line: '3', path: 'ligne-3', color: 'bg-ligne3', from: 'Quincieux', to: 'Givors' },
  { line: '4', path: 'ligne-4', color: 'bg-ligne4', from: 'Lissieu', to: 'Villeurbanne' },
  { line: '5', path: 'ligne-5', color: 'bg-ligne5', from: 'Saint-Fons', to: 'Bron' },
  { line: '6', path: 'ligne-6', color: 'bg-ligne6', from: 'Rilleux la Pape', to: 'Saint-Genis-Laval' },
  { line: '7', path: 'ligne-7', color: 'bg-ligne7', from: 'Rilleux', to: 'Solaize' },
  { line: '8', path: 'ligne-8', color: 'bg-ligne8', from: 'La Tour-de-Salvagny', to: 'Bron' },
  { line: '9', path: 'ligne-9', color: 'bg-ligne9', from: 'Jonage', to: 'Saint-Genis-Laval' },
  { line: '10', path: 'ligne-10', color: 'bg-ligne10', from: "Marcy-L'Étoile", to: 'Meyzieu' },
  { line: '11', path: 'ligne-11', color: 'bg-ligne11', from: 'Craponne', to: 'Chassieu' },
  { line: '12', path: 'ligne-12', color: 'bg-ligne12', from: 'Lyon', to: 'Saint-Priest' },
  { line: '13', path: 'ligne-13', color: 'bg-ligne13', from: 'Rillieux', to: 'Corbas' }
]
</script>
