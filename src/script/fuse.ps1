#!bin/pwsh
$matchs = import-csv -Path ./public/foot.csv -Delimiter ","
$country = import-csv -Path ./public/country.csv -Delimiter ","

Foreach ($match in $matchs) {
    $away_team = $match.away_team
    $home_team = $match.home_team
    $away_team = $country | Where { $_.Name -eq $away_team }
    $home_team = $country | Where { $_.Name -eq $home_team }

    $match | Add-Member -NotePropertyName home_team_code -NotePropertyValue $home_team.Code
    $match | Add-Member -NotePropertyName away_team_code -NotePropertyValue $away_team.Code
} 

$fileName = "fused"
$csvFileName = "./public/$fileName.csv"
$matchs | convertTo-csv | out-file  $csvFileName -Encoding utf8
write-host "Done" -ForegroundColor Green -BackgroundColor Black
