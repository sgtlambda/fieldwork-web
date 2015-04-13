<?php
/**
 * Plugin Name: enqueue_fieldwork_assets
 */

/**
 * Enqueues the fieldwork assets in a WP environment
 */

$enqueue_fieldwork_assets = function () {

    wp_register_script('recaptcha-api', 'https://www.google.com/recaptcha/api.js');
    wp_enqueue_script('fieldwork', plugins_url('dist/fieldwork.js', __FILE__), ['jquery', 'recaptcha-api']);
    wp_enqueue_style('fieldwork', plugins_url('dist/fieldwork.css', __FILE__));

};

add_action('wp_enqueue_scripts', $enqueue_fieldwork_assets);
add_action('admin_enqueue_scripts', $enqueue_fieldwork_assets);