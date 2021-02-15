@servers(['web' => 'alain@vps817507.ovh.net'])

@setup
  date_default_timezone_set('Europe/Paris');

  $root_dir = "/home/alain/web/claragames";

  $dirlinks = [ 'temp/logs' ];
  {{-- $filelinks = ['config/user.config.php']; --}}

  $nb_releases = 3;
  $remote = 'git@github.com:AlainDessi/ClaraMemory.git';

  $repo_dir = $root_dir . "/repo";
  $shared_dir = $root_dir . "/shared";
  $current_dir = $root_dir . "/current";
  $release_dir = $root_dir . "/releases/" . date('YmdHis');
@endsetup

@macro( 'setconfig' )
  links
@endmacro

@macro( 'deploy' )
  createrelease
  composer
  links
  linkcurrent
  permissions
@endmacro

@task('createrelease')
    mkdir -p {{ $release_dir }};
    @if($remote)
        [ -d {{ $repo_dir }} ] || git clone {{ $remote }} {{ $repo_dir }};
        cd {{ $repo_dir }};
        git pull origin master;
    @endif
    cd {{ $repo_dir }};
    git archive master | tar -x -C {{ $release_dir }};
    echo "Création de {{ $release_dir }}";
@endtask

@task('composer')
    mkdir -p {{ $shared_dir }}/vendor;
    ln -s {{ $shared_dir }}/vendor {{ $release_dir }}/vendor;
    cd {{ $release_dir }};
    composer update --no-dev --no-progress;
@endtask

@task('linkcurrent')
    rm -f {{ $current_dir }};
    ln -s {{ $release_dir }} {{ $current_dir }};
    ls {{ $root_dir }}/releases | sort -r | tail -n +{{ $nb_releases + 1 }} | xargs -I{} -r rm -rf {{ $root_dir }}/releases/{};
    echo "Lien // {{ $current_dir }} --> {{ $release_dir }}";
@endtask

@task('links')
    @foreach($dirlinks as $link)
        mkdir -p {{ $shared_dir }}/{{ $link }};
        chown :www-data {{ $shared_dir }}/{{ $link }};
        @if(strpos($link, '/'))
            mkdir -p {{ $release_dir }}/{{ dirname($link) }};
            chown :www-data {{ $release_dir }}/{{ dirname($link) }};
        @endif
        chmod 775 {{ $shared_dir }}/{{ $link }};
        ln -s {{ $shared_dir }}/{{ $link }} {{ $release_dir }}/{{ $link }};
    @endforeach
    @foreach($filelinks as $link)
        ln -s {{ $shared_dir }}/{{ $link }} {{ $release_dir }}/{{ $link }};
    @endforeach
    echo "Liens Finished";
@endtask

@task('rollback')
    rm -f {{ $current_dir }};
    ls {{ $root_dir }}/releases | tail -n 2 | head -n 1 | xargs -I{} -r ln -s {{ $root_dir }}/releases/{} {{ $current_dir }};
@endtask

@task('permissions')
  chown -R :www-data {{ $release_dir }};
  {{-- chmod -R 750 {{ $release_dir }}/app;
  chmod -R 750 {{ $release_dir }}/boot;
  chmod -R 750 {{ $release_dir }}/config;
  chmod -R 750 {{ $release_dir }}/bdd;
  chmod -R 750 {{ $release_dir }}/resources; --}}
  chmod -R 755 {{ $release_dir }}/public;
  chmod -R 755 {{ $release_dir }}/temp;
  echo "permissions effectué";
@endtask
