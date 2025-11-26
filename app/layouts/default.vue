<template>
  <div class="min-h-screen bg-zinc-950 flex flex-col">
    <!-- Main Content -->
    <main class="flex-1 pb-20 overflow-y-auto">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 safe-area-inset-bottom">
      <div class="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.to" 
          :to="item.to"
          class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
          :class="[
            isActive(item.to) 
              ? 'text-primary-400 bg-primary-500/10' 
              : 'text-zinc-500 hover:text-zinc-300'
          ]"
        >
          <UIcon :name="item.icon" class="size-5" />
          <span class="text-xs font-medium">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/', icon: 'i-heroicons-home', label: 'Home' },
  { to: '/transactions', icon: 'i-heroicons-banknotes', label: 'Transactions' },
  { to: '/reports', icon: 'i-heroicons-chart-bar', label: 'Reports' },
  { to: '/profile', icon: 'i-heroicons-user-circle', label: 'Profile' }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
