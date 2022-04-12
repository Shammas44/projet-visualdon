#!bin/pwsh
$matchs = import-csv -Path ./public/rawdata.csv -Delimiter ","
$victory = 0
$defeat = 0
$egality = 0
$_goals = 0

Foreach ($match in $matchs) {
    #$dateUnits = $match.date.split('-')
    #$dateString = $dateUnits[1] + '.' + $dateUnits[0] + '.' + $dateUnits[2]
    #$match.date = [DateTime]$dateString | get-date -Format dd.MM.yyyy
    $home_team = $match.home_team
    $away_team = $match.away_team
    $away_score = $match.away_score
    $home_score = $match.home_score
    if (($home_team -eq 'Switzerland') -or ($away_team -eq 'Switzerland')) {
        
        if ($home_team -eq 'Switzerland') {
            $_goals += $home_score
            if ($home_score -gt $away_score) {
                $victory += 1
            }
            elseif ($home_score -lt $away_score) {
                $defeat += 1
            }
            else {
                $egality += 1
            }
        }
        else {
            $_goals += $away_score
            if ($home_score -lt $away_score) {
                $victory += 1
            }
            elseif ($home_score -gt $away_score) {
                $defeat += 1
            }
            else {
                $egality += 1
            }
        }
        $total = $victory + $egality + $defeat
        $match.victory = 100 * $victory / $total
        $match.egality = 100 * $egality / $total
        $match.defeat = 100 * $defeat / $total
        $match.goals = $_goals
    }
    else {
        $match.date = 'null'
    }
} 

$selectedMatchs = $matchs | where-object { $_.date -ne 'null' }
$fileName = "foot"
$csvFileName = "./public/$fileName.csv"
$selectedMatchs | convertTo-csv | out-file  $csvFileName -Encoding unicode
