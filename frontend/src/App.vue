<template>
  <router-view />
</template>

<script setup>
// 使用 Vue Router 来管理页面
</script>

<style>
:root {
  --bg-color: #020202;
  --fg-color: #dec7f7;
  --accent-color: #f63b57;
  --glass-bg: rgba(2, 2, 2, 0.4);
  --glass-border: rgba(222, 199, 247, 0.2);
}

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-color);
  color: var(--fg-color);
}

#app {
  font-family: 'JetBrains Mono', 'Space Grotesk', 'Noto Sans SC', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--fg-color);
  background-color: var(--bg-color);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-color);
}

::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}

/* 全局按钮样式 */
button {
  font-family: inherit;
}
</style>
