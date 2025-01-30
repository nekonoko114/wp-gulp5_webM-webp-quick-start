<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/modern-css-reset/dist/reset.min.css" />
    <link href="https://use.fontawesome.com/releases/v6.2.0/css/all.css" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/css/style.css">
    <title><?php bloginfo(); ?></title>
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <header class="header">
        <div class="header-inner l-flex inner">
            <?php
            wp_nav_menu(
                array(
                    'theme_location' => 'header',
                    'menu_class' => 'header-ul',
                    'menu_id' => 'header-ul',
                    'container' => 'nav',
                    'container_class' => 'header-nav',
                    'container_id' => 'header-nav',
                    'depth' => 0,
                )
            );
            ?>
            <div class="header-logo">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo/G-template-theme-logo-wegle.webp" alt="ロゴ">
            </div>
        </div>
    </header>

    <!--フロントページのみカスタムヘッダーを表示-->
    <?php if (is_front_page() || is_home()): ?>
        <div class="l-front-fv">
            <?php if (get_header_image()): ?>
                <div class="custom-header">
                    <p class="custom-header-description"><?php bloginfo("description"); ?></p>
                    <img src="<?php header_image(); ?>" alt="<?php bloginfo('name'); ?>" width="<?php echo get_custom_header()->width; ?>" height="<?php echo get_custom_header()->height; ?>">
                </div>
            <?php endif; ?>
        <?php else : ?>
            <?php get_template_part('template-parts/content/l-common'); ?>
        <?php endif; ?>