# Generated by Django 4.0.2 on 2022-02-13 06:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='useraccount',
            old_name='first_name',
            new_name='username',
        ),
        migrations.RemoveField(
            model_name='useraccount',
            name='last_name',
        ),
        migrations.AlterField(
            model_name='useraccount',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
