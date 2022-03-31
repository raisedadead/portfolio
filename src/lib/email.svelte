<script lang="ts">
  const email = new String('supPo    Rt @ mrug esh.dev')
    .toLowerCase()
    .replaceAll(' ', '')
    .split('')
    .reverse()
    .join('');
</script>

<a href="mailto:${email}"> <span class="reversed">{email}</span></a>

<style>
  .reversed {
    unicode-bidi: bidi-override;
    direction: rtl;
    text-align: left;
  }
</style>
