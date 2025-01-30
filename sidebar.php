<aside class="l-aside">
    <?php if (is_active_sidebar('sidebar-1')) : ?>
        <?php dynamic_sidebar('sidebar-1'); ?>
    <?php else : ?>
        <p>サイドバーウィジェットを設定してください。</p>
    <?php endif; ?>
</aside>