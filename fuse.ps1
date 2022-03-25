#!bin/pwsh
$matchs = import-csv -Path ./public/foot.csv -Delimiter ","
$country = import-csv -Path ./public/country.csv -Delimiter ","
$victory = 0
$defeat = 0
$egality = 0
$i = 0

Foreach ($match in $matchs) {
    $away_team = $match.away_team
    $home_team = $match.home_team
    $away_team = $country | Where { $_.Name -eq $away_team }
    $home_team = $country | Where { $_.Name -eq $home_team }
    # Write-Host $away_team.Code

    $match | Add-Member -NotePropertyName home_team_code -NotePropertyValue $home_team.Code
    $match | Add-Member -NotePropertyName away_team_code -NotePropertyValue $away_team.Code
} 

$fileName = "fused"
$csvFileName = "$fileName.csv"
$matchs | convertTo-csv | out-file  $csvFileName -Encoding utf8
