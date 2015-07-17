<?php 
// conexão
$conn = new mysqli("localhost", "u112568323_jogo", "JogoDoVacilo", "u112568323_jogo");
if ($conn->connect_error)
    die("Connection failed: " . mysqli_connect_error());
// verificar se bateu recorde buscando o pior recorde
$nome  = $conn->real_escape_string($_POST["nome"]);
$tempo = $conn->real_escape_string($_POST["tempo"]);
$query = $conn->query("select id, tempo_perdido from maiores_vacilos order by tempo_perdido desc");

if ($query) {
    $resultado = mysqli_fetch_array($query);
    $idPiorRecorde = $resultado[0];
    $valorPiorRecorde = $resultado[1];
    $numeroRecordes = mysqli_num_rows($query);
} else {
    $numeroRecordes   = 0;
    $valorPiorRecorde = 0;
}
// se bateu, cadastrar o vacilão
if ($valorPiorRecorde > $tempo || $numeroRecordes < 20) {
    $conn->query("insert into maiores_vacilos(nome_vacilao, tempo_perdido) values ('$nome', $tempo)");
    if ($numeroRecordes > 19) {
        $conn->query("delete from maiores_vacilos where id = $idPiorRecorde");
    }
    print "true";
} else {
    print "false";
}

?>