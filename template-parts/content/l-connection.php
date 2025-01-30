<!-- 関連記事 -->
<div class="connection-post">
    <h2 class="connection_archive">関連記事</h2>
    <?php
    $cats = get_the_category();
    if (!empty($cats)) {
        $cat_id = $cats[0]->cat_ID;

        $connection_args = array(
            'post_type'      => 'post',
            'posts_per_page' => 5,
            'post__not_in'   => array(get_the_ID()),
            'cat'            => $cat_id,
            'orderby'        => 'rand',
        );

        $connection_query = new WP_Query($connection_args);

        if ($connection_query->have_posts()): ?>
            <div class="related-posts">
                <?php while ($connection_query->have_posts()): $connection_query->the_post(); ?>
                    <div class="related-post-wrapper l-flex">
                        <div class="related-post-thumbnail">
                            <figure>
                                <?php if (has_post_thumbnail()): ?>
                                    <?php the_post_thumbnail(); ?>
                                <?php else: ?>
                                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/no-image.jpg" alt="No Image">
                                <?php endif; ?>
                            </figure>
                        </div>
                        <div class="related-post-content">
                            <h3 class="related-post-title"><?php the_title(); ?></h3>
                            <p class="related-post-content-excerpt"><?php echo get_the_excerpt(); ?></p>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>
            <?php wp_reset_postdata(); ?> <!-- クエリのリセット -->
        <?php else: ?>
            <p>関連記事は見つかりませんでした</p>
    <?php endif;
    }
    ?>
</div>