# Generated by Django 2.0.5 on 2018-11-23 02:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skill', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='skill',
            name='question',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
