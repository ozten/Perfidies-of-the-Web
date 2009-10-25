#!/usr/bin/php
<?php
if (count($argv) == 2 && file_exists($argv[0])) {
    //God help us... Adv Opt will mangle names (buggy) but is the only reason to use over jsminify
    $fields = array('compilation_level' => 'ADVANCED_OPTIMIZATIONS',
                    'js_code' => file_get_contents($argv[1]),
                    'output_info' => 'compiled_code',
                    'output_format' => 'text');
    
    $curl = curl_init('http://closure-compiler.appspot.com/compile');
    
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($fields));
    
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($curl);
    
    curl_close($curl);
    echo $output;
} else {
    echo "Error expected 1 argument which is a javascript file. Unable to read file.\n";
    exit(1);
}
?>