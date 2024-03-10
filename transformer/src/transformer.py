import click

@click.group()
def cli():
    pass

@click.command()
def main():
    pass

cli.add_command(main)

if __name__ == '__main__':
    cli()