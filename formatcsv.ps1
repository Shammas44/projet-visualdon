#!bin/pwsh
$matchs = import-csv -Path ./results2.csv -Delimiter ","
$victory = 0
$defeat = 0
$egality = 0
$i = 0

Foreach ($match in $matchs) {
    $home_team = $match.home_team
    $away_team = $match.away_team
    $away_score = $match.away_score
    $home_score = $match.home_score
    if ($home_team -eq 'Switzerland') {
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
} 

$fileName = "football_results"
$csvFileName = "$fileName.csv"
$matchs | convertTo-csv | out-file  $csvFileName -Encoding unicode
