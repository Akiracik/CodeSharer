const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require("discord.js");
const db = require("croxydb");
const { readdirSync } = require("fs");

module.exports = async (client, interaction) => {
    if (interaction.isChatInputCommand()) {
        if (!interaction.guildId) return;

        readdirSync('./commands').forEach(f => {
            const cmd = require(`../commands/${f}`);
            if (interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {
                return cmd.run(client, interaction, db);
            }
        });
    } else if (interaction.isButton()) {
        // Buton etkileşimi
        if (interaction.customId === 'kod_ekle') {
            const modal = new ModalBuilder()
                .setCustomId('kod_ekleme_formu')
                .setTitle('Kod Ekleme Formu');

            const kodIsmi = new TextInputBuilder()
                .setCustomId('kod_ismi')
                .setLabel('Kod İsmi')
                .setPlaceholder('Kod Adı')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const kategori = new TextInputBuilder()
                .setCustomId('kategori')
                .setLabel('Kategori')
                .setPlaceholder('Kategori Adı')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const link = new TextInputBuilder()
                .setCustomId('link')
                .setLabel('Link')
                .setPlaceholder('Kod Linki')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const aciklama = new TextInputBuilder()
                .setCustomId('aciklama')
                .setLabel('Açıklama')
                .setPlaceholder('Ne işe yarar?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false);

            modal.addComponents(
                new ActionRowBuilder().addComponents(kodIsmi),
                new ActionRowBuilder().addComponents(kategori),
                new ActionRowBuilder().addComponents(link),
                new ActionRowBuilder().addComponents(aciklama)
            );

            await interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        // Modal etkileşimi
        if (interaction.customId === 'kod_ekleme_formu') {
            const kodIsmi = interaction.fields.getTextInputValue('kod_ismi');
            const kategori = interaction.fields.getTextInputValue('kategori');
            const link = interaction.fields.getTextInputValue('link');
            const aciklama = interaction.fields.getTextInputValue('aciklama') || '';

            // Kategoriyi bulma
            const categoryChannel = interaction.guild.channels.cache.find(channel =>
                channel.type === ChannelType.GuildCategory && channel.name.toLowerCase() === kategori.toLowerCase()
            );

            if (!categoryChannel) {
                await interaction.reply({ content: `Kategori bulunamadı: ${kategori}`, ephemeral: true });
                return;
            }

            // Kategorinin içinde yeni kanal açma
            const newChannel = await interaction.guild.channels.create({
                name: kodIsmi.toLowerCase().replace(/\s+/g, '-'),
                type: ChannelType.GuildText,
                parent: categoryChannel.id
            });

            const embed = new EmbedBuilder()
                .setTitle(kodIsmi)
                .setDescription(aciklama)
                .addFields([{ name: 'Link', value: link }])
                .setColor(0x5b85fc);

            await newChannel.send({ embeds: [embed] });

            await interaction.reply({ content: `Kod başarıyla eklendi ve kategori içinde kanal oluşturuldu: ${newChannel}.`, ephemeral: true });
        }
    }
};