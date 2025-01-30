<?php get_header(); ?>
<div class="l-common-page">
    <main class="main">
    <?php if (have_posts()): while (have_posts()): the_post(); ?>
            <div class="l-common-container">
                <?php the_content(); ?>
            </div>
            <?php endwhile; endif; ?>
    </main>
</div>
<?php get_footer(); ?>