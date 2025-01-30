<?php get_header(); ?>
<!-- l-common-page -->
<div class="l-common-page">
    <div class="l-common-flex">
        <main class="main">
            <?php if (have_posts()): while (have_posts()): the_post(); ?>
                    <div class="l-common-item-wrap">
                        <div class="l-common-time">
                            <i class="fa-regular fa-clock"></i><time datetime="<?php the_time('c') ?>"><?php the_time("Y/m/d") ?></time>
                        </div>
                        <div class="l-common-category">
                            <i class="fa-regular fa-folder"></i><b>カテゴリー:</b>
                            <?php the_category('|'); ?>
                            <?php the_tags();?>
                        </div>
                    </div>
                    <div class="l-common-container">
                        <?php the_content(); ?>
                    </div>
            <?php endwhile;
            endif; ?>
        </main>
        <?php get_sidebar(); ?>
    </div>
    
    <?php get_template_part('template-parts/content/l-connection');?>
    <?php get_template_part('template-parts/content/l-news');?>

       

</div><!-- l-common-page -->

<?php get_footer(); ?>