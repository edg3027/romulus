<script lang="ts">
  import { tooltip } from '$lib/actions/tooltip'
  import { getUserSettingsContext } from '$lib/contexts/user-settings'
  import { tw } from '$lib/utils/dom'

  export let id: number
  export let text: string | undefined = undefined
  export let genres: { id: number; name: string; nsfw: boolean }[]

  $: genre = genres.find((genre) => genre.id === id)

  const userSettings = getUserSettingsContext()
</script>

<a
  href={genre ? `/genres/${id}` : `/genre/${id}/history`}
  class={tw('inline-block underline', genre?.nsfw && !$userSettings.showNsfw && 'blur-sm')}
>
  {#if text}
    {text}
  {:else if genre}
    {genre.name}
  {:else}
    {'<Deleted Genre>'}
  {/if}
</a>

{#if genre?.nsfw}
  <span
    class="align-super text-xs font-bold text-error-500 no-underline transition dark:text-error-700"
    use:tooltip={{ content: 'NSFW' }}>N</span
  >
{/if}
