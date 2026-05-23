param([string[]]$Files)
foreach ($p in $Files) {
  if (-not (Test-Path $p)) { continue }
  $c = Get-Content $p -Raw
  $closeMotion = "</" + "motion" + ">"
  $closeDiv = "</" + "div" + ">"
  $openMotion = "<" + "motion"
  $openDiv = "<" + "div"
  $c = $c.Replace($closeMotion, $closeDiv)
  $c = $c.Replace($openMotion, $openDiv)
  Set-Content $p $c -NoNewline
}
