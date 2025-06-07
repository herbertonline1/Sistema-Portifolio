<?php

// Recebe os dados via POST
$pergunta = $_POST['pergunta'] ?? '';
$nomeUsuario = $_POST['nome'] ?? 'amigo'; // Agora vem do front

if (!$pergunta) {
    echo "Por favor, envie uma pergunta.";
    exit;
}

$apiKey = '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';
$url = 'https://openrouter.ai/api/v1/chat/completions';

$data = [
    "model" => "openai/gpt-3.5-turbo",
    "messages" => [
        [
            "role" => "system",
            "content" => "Você é um assistente simpático. Sempre cumprimente o usuário chamado $nomeUsuario antes de responder."
        ],
        [
            "role" => "user",
            "content" => $pergunta
        ]
    ],
    "temperature" => 0.7
];

$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey,
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

if ($response === false) {
    echo "Erro cURL: $curl_error";
    exit;
}

if ($http_code !== 200) {
    echo "Erro HTTP $http_code: $response";
    exit;
}

$json = json_decode($response, true);

if (isset($json['choices'][0]['message']['content'])) {
    echo $json['choices'][0]['message']['content'];
} else {
    echo "Erro na resposta: " . htmlspecialchars($response);
}
