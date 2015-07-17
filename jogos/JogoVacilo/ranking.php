<!doctype html> 
<html lang="en" manifest="cache"> 
<head>
<meta charset="UTF-8" />
<style>
<!--
table {
    border-collapse: collapse;
    text-align: left;
}

th {
    color: #000;
    padding: 10px 8px;
    border-bottom: 2px solid black;
}

td {
    color: #669;
    padding: 9px 8px 0px 8px;
    text-align: center;
}

tr:hover td {
    color: #009;
}
-->
</style></head><body>
<center>
<?php
function mask($val, $mask) {
    $val = str_pad($val, 8, '0', STR_PAD_LEFT);
    $maskared = '';
    $k = 0;
    for($i = 0; $i <= strlen ( $mask ) - 1; $i ++) {
        if ($mask [$i] == '#') {
            if (isset ( $val [$k] ))
                $maskared .= $val [$k ++];
        } else {
            if (isset ( $mask [$i] ))
                $maskared .= $mask [$i];
        }
    }
    return $maskared;
}
$conn = new mysqli("localhost", "u112568323_jogo", "JogoDoVacilo", "u112568323_jogo");
if ($conn->connect_error)
    die("Connection failed: " . mysqli_connect_error());
$resultado = $conn->query("select nome_vacilao, tempo_perdido from maiores_vacilos order by tempo_perdido limit 20");

// verifica se alguém já venceu
if ($resultado->num_rows > 0) { ?>
    <table>
        <tr>
            <th>Nome do vacil&atilde;o</th>
            <th>Tempo perdido</th>
            <th>T&aacute; de parab&eacute;ns?</th>
        </tr>
        <?php while ($row = mysqli_fetch_array($resultado)) { ?>
            <tr>
            <td><?php print substr($row[0],0,80); ?></td>
            <td><?php print mask($row[1], "#:##:##:###"); ?></td>
            <td>Claro que sim!</td>
        </tr>
        <?php } ?>
        
    </table>
    
    <br />O respeito voltou. Ponto!
    
<?php } else {
    print "Ningu&eacute;m vacilou at&eacute; agora...";
}
mysqli_free_result($resultado);
$conn->close();
?>

</center>
</body>
</html>