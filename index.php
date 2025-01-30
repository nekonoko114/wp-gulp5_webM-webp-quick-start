<?php get_header(); ?>


<main id="main-content">
    <?php if (have_posts()) : ?>
        <div class="archive-posts">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <div class="entry-thumbnail">
                        <?php
                        if (has_post_thumbnail()) : the_post_thumbnail();
                        endif
                        ?>
                    </div>
                    <div class="entry-header">
                        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                    </div>
                    <div class="entry-meta">
                        <span class="posted-on"><?php the_time('Y-m-d'); ?></span>
                    </div>

                </article>
            <?php endwhile; ?>
        </div>

        <div class="pagination">
            <?php
            the_posts_pagination(array(
                'mid_size' => 1,
                'prev_next' => false,
                'type' => 'list',
            ));
            ?>
        </div>
    <?php else : ?>
        <p><?php esc_html_e('No posts found.', 'your-theme-textdomain'); ?></p>
    <?php endif; ?>
    </section>
</main>



<?php get_footer(); ?>