const indicators = () => (`
<style>
  [src='/self-test'] {
    width: 1em;
    height: 1em;
    border: 1px solid black;
  }

  [src='/sync-status'] {
    width: 6em;
    height: 1em;
    border: 1px solid black;
  }
</style>
<iframe
  src="/self-test">
</iframe>

<br>

<iframe
  src="/sync-status">
</iframe>

<br>
`);

export default indicators;
