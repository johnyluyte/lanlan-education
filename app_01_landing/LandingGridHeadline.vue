<script setup lang="ts">
  import { computed } from 'vue'
  import { padGridRows, type GridGlyph } from '#alias-landing/gridHeadline'

  // 國語作業簿樣式的標題：每個字一格田字格，右邊一條注音格。
  // 純裝飾（aria-hidden），外層標題要另外放一份給螢幕閱讀器的純文字。
  const props = withDefaults(
    defineProps<{
      rows: GridGlyph[][]
      // 一組（字格＋注音格）的最大寬度，單位 rem
      maxUnit?: number
      // 逐字寫進格子的進場動畫（prefers-reduced-motion 時不播）
      animate?: boolean
    }>(),
    {
      maxUnit: 6.25,
      animate: false,
    },
  )

  // 只替有字的格子編號，動畫照順序一格一格出現
  const grid = computed(() => {
    let order = 0
    return padGridRows(props.rows).map((row) => row.map((glyph) => ({ ...glyph, order: glyph.char ? order++ : 0 })))
  })

  const cols = computed(() => grid.value[0]?.length ?? 1)
</script>

<template>
  <div class="grid-headline" aria-hidden="true">
    <div class="gh-grid" :style="{ '--cols': cols, '--u-max': `${maxUnit}rem` }">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="gh-row">
        <div v-for="(glyph, colIndex) in row" :key="colIndex" class="gh-unit">
          <span class="gh-cell landing-tianzige">
            <!-- prettier-ignore -->
            <span v-if="glyph.char" class="gh-char font-display" :class="{ 'landing-anim-write': animate }" :style="{ '--i': glyph.order }">{{ glyph.char }}</span>
          </span>

          <span class="gh-zhuyin">
            <span
              v-if="glyph.symbols.length"
              class="gh-symbols font-display"
              :class="{ 'landing-anim-write': animate }"
              :style="{ '--i': glyph.order }"
            >
              <!-- 輕聲：點標在第一個符號上方 -->
              <span v-if="glyph.tone === '˙'" class="gh-neutral">˙</span>
              <!-- 二、三、四聲：標在最後一個符號的右上方 -->
              <!-- prettier-ignore -->
              <span v-for="(symbol, symbolIndex) in glyph.symbols" :key="symbolIndex" class="gh-symbol">{{ symbol }}<span v-if="glyph.tone && glyph.tone !== '˙' && symbolIndex === glyph.symbols.length - 1" class="gh-tone">{{ glyph.tone }}</span></span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .grid-headline {
    container-type: inline-size;
  }

  .gh-grid {
    --line: 2px;
    --line-color: var(--color-brand-300);
    /* 一組的寬度：扣掉格線後平分容器寬，最大不超過 --u-max */
    --u: min(calc((100cqi - var(--line)) / var(--cols) - var(--line)), var(--u-max));
    --cell: calc(var(--u) * 0.73);

    width: fit-content;
    border-top: var(--line) solid var(--line-color);
    border-left: var(--line) solid var(--line-color);
    background-color: #fff;
    color: var(--color-ink);
  }

  .gh-row {
    display: flex;
  }

  .gh-unit {
    display: flex;
    border-right: var(--line) solid var(--line-color);
    border-bottom: var(--line) solid var(--line-color);
  }

  .gh-cell {
    display: grid;
    place-items: center;
    width: var(--cell);
    height: var(--cell);
  }

  .gh-char {
    font-size: calc(var(--cell) * 0.68);
    line-height: 1;
  }

  .gh-zhuyin {
    display: flex;
    align-items: center;
    width: calc(var(--u) - var(--cell) - 1px);
    padding-left: calc(var(--u) * 0.035);
    border-left: 1px solid var(--color-brand-200);
  }

  .gh-symbols {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: calc(var(--u) * 0.15);
    line-height: 1.02;
  }

  .gh-symbol {
    position: relative;
    display: block;
  }

  .gh-tone {
    position: absolute;
    top: -0.08em;
    left: 76%;
  }

  .gh-neutral {
    display: block;
    height: 0.6em;
    line-height: 0.6;
  }

  /* 窄螢幕放不下注音格：只留田字格，字放大 */
  @container (max-width: 30rem) {
    .gh-grid {
      --cell: var(--u);
    }

    .gh-zhuyin {
      display: none;
    }
  }
</style>
