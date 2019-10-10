# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-10-23 06:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OAuth_QQ',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.TextField(blank=True, default='anonymous', null=True, verbose_name='用户名')),
                ('qq_openid', models.CharField(blank=True, default='', max_length=128, null=True)),
            ],
        ),
    ]
